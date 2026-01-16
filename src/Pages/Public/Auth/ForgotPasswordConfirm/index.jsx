import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, useTheme } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { useVerifyEmail, useRequestVerifyOTP } from '../../../../Hooks/auth';

export default function VerifyForgotPassword() {
    const [otp, setOtp] = useState('');
    const theme = useTheme();
    const location = useLocation();
    const email = location.state?.email || '';
    const { verifyEmail, loading } = useVerifyEmail();
    const { requestOTP, loading: resendLoading } = useRequestVerifyOTP();

    const handleVerify = async (e) => {
        e.preventDefault();
        await verifyEmail({ email, otp });
    };

    const handleResendOTP = async () => {
        await requestOTP(email);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: theme.palette.mode === 'dark' ? '#000' : 'radial-gradient(ellipse at top right, rgba(200, 180, 220, 0.3) 0%, rgba(245, 245, 245, 1) 50%)',
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                        },
                    }}
                />

                <Box
                    sx={{
                        height: '100vh',
                        flex: '0 0 40%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            padding: { xs: 4, md: 6, lg: 5 },
                            background: theme.palette.mode === 'dark' ? '#000' : 'rgba(255, 255, 255, 0.8)',
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
                                mb: 2,
                                textAlign: 'center',
                            }}
                        >
                            Verify Your Email
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: 'center',
                                mb: 4,
                            }}
                        >
                            We've sent a verification code to {email}
                        </Typography>

                        <Box component="form" onSubmit={handleVerify}>
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        mb: 1.5,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Verification Code
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    backgroundColor: theme.palette.primary.dark,
                                    color: theme.palette.primary.contrastText,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    mb: 2,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                {loading ? 'VERIFYING...' : 'VERIFY EMAIL'}
                            </Button>

                            <Button
                                fullWidth
                                variant="text"
                                onClick={handleResendOTP}
                                disabled={resendLoading}
                                sx={{
                                    color: theme.palette.primary.main,
                                    textTransform: 'none',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {resendLoading ? 'Sending...' : 'Resend Code'}
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
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}