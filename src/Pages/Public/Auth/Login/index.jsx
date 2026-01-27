// Pages/Auth/Login/index.jsx
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    useTheme,
    CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../../../Hooks/auth';
import { useGoogleAuthLogin } from '../../../../Hooks/googleAuth';
import { signInWithGooglePopup } from '../../../../Utils/googleAuth';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const theme = useTheme();
    const navigate = useNavigate();
    const { login, loading } = useLogin();
    const googleLogin = useGoogleAuthLogin();
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const result = await login(formData);
            if (result) {
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 100);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            console.log("🔵 Starting Google Sign-In...");
            
            // Get Google access token
            const googleAccessToken = await signInWithGooglePopup();
            console.log("✅ Google token received, sending to backend...");

            // Send to backend
            const success = await googleLogin(googleAccessToken);
            
            if (success) {
                console.log("✅ Google login successful");
            } else {
                console.log("❌ Google login failed");
            }
        } catch (error) {
            console.error("❌ Google sign-in error:", error);
        } finally {
            setGoogleLoading(false);
        }
    };

    const isLoading = loading || googleLoading;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background:
                    theme.palette.mode === 'dark'
                        ? '#000'
                        : 'radial-gradient(ellipse at top right, rgba(200, 180, 220, 0.3) 0%, rgba(245, 245, 245, 1) 50%)',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    height: '100vh',
                }}
            >
                <Box
                    sx={{
                        height: '100vh',
                        flex: '0 0 60%',
                        backgroundImage: `url('/Images/auth2.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(0, 0, 0, 0.2)'
                                    : 'rgba(255, 255, 255, 0.2)',
                        },
                    }}
                />

                <Box
                    sx={{
                        height: '100vh',
                        flex: { xs: '1 1 100%', md: '0 0 40%' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            padding: { xs: 4, md: 6, lg: 5 },
                            background:
                                theme.palette.mode === 'dark'
                                    ? '#000'
                                    : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(4px)',
                            border: `1px solid ${theme.palette.divider}`,
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: '24px',
                            mx: 3,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                mb: 4,
                                textAlign: 'center',
                            }}
                        >
                            Login
                        </Typography>

                        <Box component="form" onSubmit={handleLogin}>
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        mb: 1.5,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    E-Mail
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    placeholder="E.g. user@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        mb: 1.5,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <Link
                                    to="/forgot-password"
                                    style={{
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.3s ease',
                                        pointerEvents: isLoading ? 'none' : 'auto',
                                        opacity: isLoading ? 0.5 : 1,
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    backgroundColor: theme.palette.primary.dark,
                                    color: theme.palette.primary.contrastText,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main,
                                    },
                                    '&:disabled': {
                                        backgroundColor: theme.palette.action.disabledBackground,
                                    },
                                }}
                            >
                                {loading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={20} color="inherit" />
                                        LOGGING IN...
                                    </Box>
                                ) : (
                                    'LOGIN'
                                )}
                            </Button>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: 'center',
                                mt: 3,
                            }}
                        >
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                style={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    pointerEvents: isLoading ? 'none' : 'auto',
                                    opacity: isLoading ? 0.5 : 1,
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            my: 3
                        }}>
                            <Box sx={{ flex: 1, height: '1px', bgcolor: theme.palette.divider }} />
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                            <Box sx={{ flex: 1, height: '1px', bgcolor: theme.palette.divider }} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                startIcon={
                                    googleLoading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    )
                                }
                                sx={{
                                    color: theme.palette.text.primary,
                                    borderColor: theme.palette.divider,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1.5,
                                    backgroundColor: 'transparent',
                                    '& .MuiButton-startIcon': {
                                        margin: 0,
                                    },
                                    '&:hover': {
                                        borderColor: theme.palette.text.secondary,
                                        backgroundColor:
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.05)'
                                                : 'rgba(0, 0, 0, 0.05)',
                                    },
                                    '&:disabled': {
                                        borderColor: theme.palette.divider,
                                        opacity: 0.6,
                                    },
                                }}
                            >
                                {googleLoading ? 'Logging in with Google...' : 'Login with Google'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}