import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    useTheme,
    Checkbox,
    FormControlLabel,
    Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const theme = useTheme();

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        console.log('Register attempt:', formData);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    minHeight: '100vh',
                }}
            >

                <Box
                    sx={{
                        minHeight: '100vh',
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
                            background:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(0, 0, 0, 0.2)'
                                    : 'rgba(255, 255, 255, 0.2)',
                        },
                    }}
                />
                <Box
                    sx={{
                        minHeight: '100vh',
                        flex: '0 0 40%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 1,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            padding: { xs: 4, md: 5, lg: 4 },
                            backgroundColor: theme.palette.background.default,
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${theme.palette.divider}`,
                            width: '100%',
                            maxWidth: '650px',
                            borderRadius: '24px',
                            mx: 1,
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
                            Create Account
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: 'center',
                                mb: 4,
                            }}
                        >
                            Join us and start building amazing websites
                        </Typography>

                        <Box component="form" onSubmit={handleRegister}>
                            {/* Name Fields Row */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            mb: 1.5,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        First Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="firstName"
                                        placeholder="Kingsley"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            mb: 1.5,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        Last Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        name="lastName"
                                        placeholder="Terwase"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Box>

                            {/* Email Field */}
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
                                    placeholder="kingsleyterwase@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Box>

                            <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
                                {/* Password Field */}
                                <Box sx={{ width: '100%' }}>
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
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Box>

                                <Box sx={{ width: '100%' }}>
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
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Stack>


                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            '&.Mui-checked': {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        I agree to the{' '}
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: theme.palette.primary.main,
                                                cursor: 'pointer',
                                                '&:hover': { textDecoration: 'underline' },
                                            }}
                                        >
                                            Terms & Conditions
                                        </Typography>
                                    </Typography>
                                }
                                sx={{ mb: 3 }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: theme.palette.primary.dark,
                                    color: theme.palette.primary.contrastText,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    padding: '14px',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                CREATE ACCOUNT
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
                            Already have an account?{' '}
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

                        <Box sx={{ position: 'relative', my: 3 }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    bgcolor: theme.palette.divider,
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    position: 'relative',
                                    textAlign: 'center',
                                    color: theme.palette.text.secondary,
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(100, 90, 120, 0.25)' : 'rgba(255, 255, 255, 0.8)',
                                    display: 'inline-block',
                                    px: 2,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                Or continue with
                            </Typography>
                        </Box>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ display: 'block' }}
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                                        1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                                        3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 
                                        1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                                        20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                                        8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 
                                        1.64l3.15-3.15C17.45 2.09 14.97 1 12 
                                        1 7.7 1 3.99 3.47 2.18 7.07l3.66 
                                        2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
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
                            }}
                        >
                            Sign up with Google
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}