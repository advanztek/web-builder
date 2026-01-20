import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    useTheme,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fade,
    Zoom,
} from '@mui/material';
import {
    Diamond,
    Rocket,
    Star,
    // Crown,
    CheckCircle,
    ArrowBack,
} from '@mui/icons-material';
import { Crown16Filled, Crown24Filled, CrownFilled } from '@fluentui/react-icons';

const BuyCreditsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    const packages = [
        {
            id: 1,
            icon: <Diamond sx={{ fontSize: 60 }} />,
            credits: 100,
            price: 9.99,
            label: 'Starter',
            savings: null,
            popular: false,
            features: [
                'Perfect for small projects',
                '1 month validity',
                'Basic support',
                'Email notifications',
            ],
            color: '#667eea',
        },
        {
            id: 2,
            icon: <Rocket sx={{ fontSize: 60 }} />,
            credits: 500,
            price: 39.99,
            label: 'Professional',
            savings: '20%',
            popular: true,
            features: [
                'Great for growing teams',
                '3 months validity',
                'Priority support',
                'Bonus resources',
                'Advanced analytics',
            ],
            color: '#f093fb',
        },
        {
            id: 3,
            icon: <Star sx={{ fontSize: 60 }} />,
            credits: 1000,
            price: 69.99,
            label: 'Business',
            savings: '30%',
            popular: false,
            features: [
                'Best for professionals',
                '6 months validity',
                'Premium support',
                'Exclusive templates',
                'Priority processing',
            ],
            color: '#4facfe',
        },
        {
            id: 4,
            icon: <CrownFilled style={{ fontSize: 50 }} />,
            credits: 5000,
            price: 299.99,
            label: 'Enterprise',
            savings: '40%',
            popular: false,
            features: [
                'Enterprise solution',
                '1 year validity',
                'VIP support',
                'Custom integrations',
                'Dedicated account manager',
                'White-label options',
            ],
            color: '#ffd700',
        },
    ];

    const handleCheckout = (credits, price) => {
        navigate(`/dashboard/checkout?credits=${credits}&price=${price}`);
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                // background: 'linear-gradient(135deg, #040930ff 0%, #000000ff 100%)',
                pt: 8,
                pb: 8,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Fade in timeout={600}>
                    <Box sx={{ textAlign: 'center', mt:7, mb: 8 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                            }}
                        >
                            Choose Your Credit Package
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                mb: 4,
                            }}
                        >
                            Select the perfect plan to power your creative projects
                        </Typography>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                border: '2px solid white',
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: 'white',
                                    color: theme.palette.primary.main,
                                    borderColor: 'white',
                                },
                            }}
                        >
                            Back to Dashboard
                        </Button>
                    </Box>
                </Fade>

                <Grid container spacing={4}>
                    {packages.map((pkg, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pkg.id}>
                            <Zoom in timeout={600 + index * 100}>
                                <Card
                                    onMouseEnter={() => setHoveredCard(pkg.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    sx={{
                                        height: '100%',
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'visible',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: pkg.popular
                                            ? `3px solid ${theme.palette.primary.main}`
                                            : '1px solid transparent',
                                        transform:
                                            hoveredCard === pkg.id
                                                ? 'translateY(-10px) scale(1.02)'
                                                : pkg.popular
                                                    ? 'scale(1.05)'
                                                    : 'scale(1)',
                                        boxShadow:
                                            hoveredCard === pkg.id
                                                ? '0 20px 40px rgba(0,0,0,0.2)'
                                                : pkg.popular
                                                    ? '0 10px 30px rgba(102, 126, 234, 0.3)'
                                                    : theme.shadows[2],
                                    }}
                                >
                                    {/* Popular Badge */}
                                    {pkg.popular && (
                                        <Chip
                                            label="MOST POPULAR"
                                            sx={{
                                                position: 'absolute',
                                                top: 20,
                                                right: -10,
                                                bgcolor: theme.palette.primary.main,
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                letterSpacing: '0.5px',
                                                transform: 'rotate(10deg)',
                                                zIndex: 1,
                                            }}
                                        />
                                    )}

                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        {/* Icon */}
                                        <Box
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                margin: '0 auto 20px',
                                                backgroundColor: '#000',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                animation: 'pulse 2s infinite',
                                                '@keyframes pulse': {
                                                    '0%, 100%': { transform: 'scale(1)' },
                                                    '50%': { transform: 'scale(1.05)' },
                                                },
                                            }}
                                        >
                                            {pkg.icon}
                                        </Box>

                                        {/* Credits Amount */}
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 700,
                                                color: theme.palette.text.primary,
                                                mb: 1,
                                            }}
                                        >
                                            {pkg.credits.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: theme.palette.text.secondary, mb: 2 }}
                                        >
                                            Credits
                                        </Typography>

                                        {/* Price */}
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                color: theme.palette.primary.main,
                                                mb: 1,
                                            }}
                                        >
                                            ${pkg.price}
                                        </Typography>

                                        {/* Savings Badge */}
                                        {pkg.savings && (
                                            <Chip
                                                label={`Save ${pkg.savings}`}
                                                sx={{
                                                    bgcolor: '#4ade80',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    mb: 3,
                                                }}
                                            />
                                        )}

                                        {/* Features */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                my: 3,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <List dense disablePadding>
                                                {pkg.features.map((feature, idx) => (
                                                    <ListItem key={idx} disableGutters>
                                                        <ListItemIcon sx={{ minWidth: 30 }}>
                                                            <CheckCircle
                                                                sx={{
                                                                    color: '#4ade80',
                                                                    fontSize: 20,
                                                                }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={feature}
                                                            primaryTypographyProps={{
                                                                fontSize: '0.85rem',
                                                                color: theme.palette.text.secondary,
                                                            }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Paper>

                                        {/* Buy Button */}
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => handleCheckout(pkg.credits, pkg.price)}
                                            sx={{
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, ${pkg.color} 0%, ${theme.palette.primary.dark} 100%)`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: `0 10px 20px ${pkg.color}40`,
                                                },
                                            }}
                                        >
                                            Buy Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Zoom>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default BuyCreditsPage;