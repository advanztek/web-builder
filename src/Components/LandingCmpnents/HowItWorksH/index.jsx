import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { steps } from './data';
import {
  TrendingUp as TrendingUpIcon,
  East as ArrowIcon,
} from '@mui/icons-material';
import { FONT_FAMILY } from '../../../Config/font';

const HowItWorksH = () => {
    return (
        <Box 
            sx={{ 
                py: { xs: 10, md: 15 }, 
                position: 'relative',
                overflow: 'hidden',               
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
    
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        mb: { xs: 6, md: 10 },
                        opacity: 0,
                        animation: 'fadeInUp 1s ease-out forwards',
                        '@keyframes fadeInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(30px)',
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    <Typography 
                        variant="overline" 
                        sx={{ 
                            color: '#4A9EFF',
                            fontSize: '14px',
                            fontWeight: 700,
                            letterSpacing: '3px',
                            mb: 2,
                            display: 'block',
                        }}
                    >
                        PROCESS
                    </Typography>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 800, 
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '2.5rem' },
                            background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        How It Works
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#888',
                            maxWidth: '600px',
                            mx: 'auto',
                            lineHeight: 1.6,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                        }}
                    >
                        Four simple steps to launch your application
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 4, md: 6 }}>
                    {steps.map((step, index) => (
                        <Grid size={{ xs:12, sm:6, md:4 }} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    textAlign: 'center',
                                    position: 'relative',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '24px',
                                    p: { xs: 3, md: 4 },
                                    height: '100%',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: 0,
                                    animation: `fadeInScale 0.8s ease-out ${0.2 + index * 0.15}s forwards`,
                                    '@keyframes fadeInScale': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'scale(0.9) translateY(20px)',
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'scale(1) translateY(0)',
                                        },
                                    },
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(74, 158, 255, 0.3)',
                                        transform: 'translateY(-12px)',
                                        boxShadow: '0 20px 60px rgba(74, 158, 255, 0.15)',
                                        '& .step-number': {
                                            transform: 'scale(1.1) rotateY(360deg)',
                                        },
                                        '& .step-icon': {
                                            transform: 'scale(1.2) rotate(10deg)',
                                        },
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '80px',
                                        height: '80px',
                                        background: 'radial-gradient(circle at top right, rgba(74, 158, 255, 0.1) 0%, transparent 70%)',
                                        borderRadius: '0 24px 0 0',
                                    }}
                                />

                                <Box
                                    className="step-number"
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        mb: 3,
                                        transition: 'transform 0.6s ease',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '64px', md: '80px' },
                                            fontWeight: 900,
                                            lineHeight: 1,
                                            background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                                            backgroundSize: '200% 200%',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            position: 'relative',
                                            animation: 'gradientShift 4s ease infinite',
                                            '@keyframes gradientShift': {
                                                '0%, 100%': {
                                                    backgroundPosition: '0% 50%',
                                                },
                                                '50%': {
                                                    backgroundPosition: '100% 50%',
                                                },
                                            },
                                        }}
                                    >
                                        {step.number}
                                    </Typography>
                                    
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '120px',
                                            height: '120px',
                                            background: 'radial-gradient(circle, rgba(74, 158, 255, 0.15) 0%, transparent 70%)',
                                            borderRadius: '50%',
                                            zIndex: -1,
                                        }}
                                    />
                                </Box>

                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 700, 
                                        mb: 2,
                                        color: '#fff',
                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                    }}
                                >
                                    {step.title}
                                </Typography>

                                <Typography 
                                    sx={{ 
                                        color: '#aaa',
                                        lineHeight: 1.7,
                                        fontSize: { xs: '0.9rem', md: '1rem' },
                                    }}
                                >
                                    {step.description}
                                </Typography>

                                {index < steps.length - 1 && (
                                    <Box
                                        className="step-icon"
                                        sx={{
                                            position: 'absolute',
                                            top: { md: '50%' },
                                            right: { md: '-48px' },
                                            transform: { md: 'translateY(-50%)' },
                                            display: { xs: 'none', md: 'flex' },
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '48px',
                                            height: '48px',
                                            background: 'rgba(74, 158, 255, 0.1)',
                                            borderRadius: '50%',
                                            border: '2px solid rgba(74, 158, 255, 0.3)',
                                            transition: 'all 0.3s ease',
                                            zIndex: 2,
                                        }}
                                    >
                                        <ArrowIcon 
                                            sx={{ 
                                                color: '#4A9EFF', 
                                                fontSize: 24,
                                            }} 
                                        />
                                    </Box>
                                )}

                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '60%',
                                        height: '3px',
                                        background: 'linear-gradient(90deg, transparent 0%, #4A9EFF 50%, transparent 100%)',
                                        borderRadius: '3px 3px 0 0',
                                        opacity: 0.5,
                                    }}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Box
                    sx={{
                        mt: 8,
                        textAlign: 'center',
                        opacity: 0,
                        animation: 'fadeIn 1s ease-out 1.2s forwards',
                        '@keyframes fadeIn': {
                            '0%': { opacity: 0 },
                            '100%': { opacity: 1 },
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                            px: 4,
                            py: 2,
                            background: 'rgba(74, 158, 255, 0.05)',
                            border: '1px solid rgba(74, 158, 255, 0.2)',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            '&:hover':{
                               background: 'rgba(1, 13, 27, 0.05)', 
                            }
                        }}
                    >
                        <Typography sx={{ fontFamily: FONT_FAMILY.secondary, color: '#888', fontSize: '1rem' }}>
                            Get started in minutes
                        </Typography>
                        <TrendingUpIcon sx={{ color: '#4A9EFF' }} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HowItWorksH;