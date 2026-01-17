// Pages/Public/GoogleCallback.jsx
import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '../../../Utils/toast';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleGoogleCallback = () => {
            try {
                // Get the full URL
                const fullUrl = window.location.href;

                // Check if this is a popup (has window.opener)
                const isPopup = window.opener && !window.opener.closed;

                // Option 1: Data might be in URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                const userData = urlParams.get('user');

                if (token) {
                    const user = userData ? JSON.parse(decodeURIComponent(userData)) : null;

                    if (isPopup) {
                        // Send message to parent window
                        window.opener.postMessage({
                            type: 'GOOGLE_AUTH_SUCCESS',
                            data: {
                                result: { token, user }
                            }
                        }, window.location.origin);

                        // Close this popup
                        window.close();
                    } else {
                        // Not a popup, handle directly
                        localStorage.setItem('token', token);
                        localStorage.setItem('authToken', token);
                        if (user) {
                            localStorage.setItem('user', JSON.stringify(user));
                        }

                        showToast.success('Login successful!');
                        navigate('/dashboard', { replace: true });
                    }
                    return;
                }

                // Option 2: Data might be in the response body (if backend sends HTML with embedded data)
                const scriptTag = document.getElementById('auth-data');
                if (scriptTag) {
                    const authData = JSON.parse(scriptTag.textContent);

                    if (authData.success && authData.result) {
                        const { token, user } = authData.result;

                        if (isPopup) {
                            window.opener.postMessage({
                                type: 'GOOGLE_AUTH_SUCCESS',
                                data: authData
                            }, window.location.origin);
                            window.close();
                        } else {
                            localStorage.setItem('token', token);
                            localStorage.setItem('authToken', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            showToast.success('Login successful!');
                            navigate('/dashboard', { replace: true });
                        }
                        return;
                    }
                }

                // If we get here, something went wrong
                throw new Error('Authentication data not found');

            } catch (error) {
                console.error('Google callback error:', error);

                const isPopup = window.opener && !window.opener.closed;

                if (isPopup) {
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        data: { message: error.message }
                    }, window.location.origin);
                    window.close();
                } else {
                    showToast.error('Google login failed');
                    navigate('/login', { replace: true });
                }
            }
        };

        handleGoogleCallback();
    }, [navigate, location]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                gap: 2,
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
                Completing Google Sign In...
            </Typography>
        </Box>
    );
};

export default GoogleCallback;