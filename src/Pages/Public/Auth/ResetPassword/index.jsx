// pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, useTheme } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../../../../Hooks/auth';

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const theme = useTheme();
    const { resetPassword, loading } = useResetPassword();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return;
        }
        
        await resetPassword({
            token,
            password: formData.password,
        });
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
                            Reset Password
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: 'center',
                                mb: 4,
                            }}
                        >
                            Enter your new password
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        mb: 1.5,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    New Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
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
                                    Confirm Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
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
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                {loading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}