import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip
} from '@mui/material';
import {
  Code as CodeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudUpload as CloudUploadIcon,
  Devices as DevicesIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { pricingPlans } from './data'

const PricingH = () => {
    return (
        <>
            <Box sx={{
                py: 16,
                background: 'radial-gradient(circle at 50% 0%, rgba(74, 158, 255, 0.08) 0%, #000 50%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '150%',
                    height: '100%',
                    background: 'radial-gradient(ellipse at center, rgba(107, 95, 255, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }
            }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: '#4A9EFF',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                letterSpacing: '0.15em',
                                mb: 2,
                                display: 'block'
                            }}
                        >
                            PRICING PLANS
                        </Typography>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '2.5rem' },
                                background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Choose Your Plan
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#999',
                                fontWeight: 400,
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            Scale your business with flexible pricing designed for teams of all sizes
                        </Typography>
                    </Box>
                    <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
                        {pricingPlans.map((plan, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        background: plan.popular
                                            ? 'linear-gradient(135deg, rgba(74, 158, 255, 0.15) 0%, rgba(107, 95, 255, 0.1) 100%)'
                                            : 'rgba(17, 17, 17, 0.6)',
                                        backdropFilter: 'blur(20px)',
                                        border: plan.popular ? '2px solid #4A9EFF' : '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '24px',
                                        position: 'relative',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        overflow: 'visible',
                                        transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                                        '&:hover': {
                                            transform: plan.popular ? 'scale(1.08)' : 'scale(1.03)',
                                            borderColor: plan.popular ? '#5AAFFF' : 'rgba(74, 158, 255, 0.4)',
                                            boxShadow: plan.popular
                                                ? '0 30px 60px rgba(74, 158, 255, 0.35), 0 0 60px rgba(74, 158, 255, 0.2)'
                                                : '0 20px 40px rgba(0, 0, 0, 0.4)',
                                            '& .plan-glow': {
                                                opacity: 1
                                            }
                                        }
                                    }}
                                >
                                    {/* Glow effect */}
                                    <Box
                                        className="plan-glow"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            borderRadius: '24px',
                                            background: plan.popular
                                                ? 'linear-gradient(135deg, rgba(74, 158, 255, 0.2) 0%, rgba(107, 95, 255, 0.2) 100%)'
                                                : 'rgba(74, 158, 255, 0.1)',
                                            opacity: plan.popular ? 0.6 : 0,
                                            transition: 'opacity 0.4s',
                                            pointerEvents: 'none',
                                            filter: 'blur(20px)',
                                            zIndex: -1
                                        }}
                                    />

                                    {plan.popular && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -16,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                zIndex: 2
                                            }}
                                        >
                                            <Chip
                                                label="MOST POPULAR"
                                                sx={{
                                                    background: 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    letterSpacing: '0.1em',
                                                    px: 2,
                                                    height: 32,
                                                    boxShadow: '0 8px 24px rgba(74, 158, 255, 0.4)',
                                                    '& .MuiChip-label': {
                                                        px: 2
                                                    }
                                                }}
                                            />
                                        </Box>
                                    )}

                                    <CardContent sx={{ p: 5, pt: plan.popular ? 6 : 5 }}>
                                        {/* Plan Header */}
                                        <Box sx={{ mb: 4 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 700,
                                                    mb: 1,
                                                    color: '#fff'
                                                }}
                                            >
                                                {plan.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                                                <Typography
                                                    variant="h2"
                                                    component="span"
                                                    sx={{
                                                        fontWeight: 800,
                                                        background: plan.popular
                                                            ? 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)'
                                                            : 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        fontSize: { xs: '3rem', md: '3.5rem' }
                                                    }}
                                                >
                                                    {plan.price}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        color: '#888',
                                                        ml: 1,
                                                        fontSize: '1.125rem',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {plan.period}
                                                </Typography>
                                            </Box>

                                            <Button
                                                fullWidth
                                                variant={plan.popular ? 'contained' : 'outlined'}
                                                size="large"
                                                sx={{
                                                    py: 1.75,
                                                    fontSize: '1rem',
                                                    fontWeight: 700,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    background: plan.popular
                                                        ? 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)'
                                                        : 'transparent',
                                                    borderColor: plan.popular ? 'transparent' : 'rgba(74, 158, 255, 0.5)',
                                                    color: '#fff',
                                                    boxShadow: plan.popular
                                                        ? '0 8px 24px rgba(74, 158, 255, 0.4)'
                                                        : 'none',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        background: plan.popular
                                                            ? 'linear-gradient(135deg, #3A8EEF 0%, #5B4FEF 100%)'
                                                            : 'rgba(74, 158, 255, 0.15)',
                                                        borderColor: '#4A9EFF',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: plan.popular
                                                            ? '0 12px 32px rgba(74, 158, 255, 0.5)'
                                                            : '0 8px 24px rgba(74, 158, 255, 0.3)'
                                                    }
                                                }}
                                            >
                                                Get Started
                                            </Button>
                                        </Box>

                                        {/* Features List */}
                                        <Box
                                            sx={{
                                                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                                pt: 4
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: '#999',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.05em',
                                                    mb: 3,
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                What's Included
                                            </Typography>
                                            {plan.features.map((feature, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        mb: 2.5,
                                                        '&:last-child': { mb: 0 }
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            minWidth: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            background: plan.popular
                                                                ? 'linear-gradient(135deg, #4A9EFF 0%, #6B5FFF 100%)'
                                                                : 'rgba(74, 158, 255, 0.2)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            mr: 2,
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            color: '#ddd',
                                                            fontSize: '0.95rem',
                                                            lineHeight: 1.5,
                                                            pt: 0.25
                                                        }}
                                                    >
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Trust indicators */}
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                mb: 2,
                                fontSize: '0.875rem'
                            }}
                        >
                            Trusted by over 10,000+ teams worldwide • Cancel anytime • No credit card required
                        </Typography>
                    </Box>
                </Container>
            </Box>

        </>
    )
}

export default PricingH
