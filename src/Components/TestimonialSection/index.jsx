import { useState } from 'react';
import { Box, Container, Typography, IconButton, useTheme } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

function TestimonialSection() {
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);

    const testimonials = [
        {
            image: "/Images/auth.png",
            quote: "This web builder transformed how we create landing pages. The intuitive interface and powerful features helped us launch our product site in just two days. Absolutely incredible tool for modern teams.",
            author: "Sarah Mitchell",
            position: "Product Manager"
        },
        {
            image: "/path/to/testimonial-2.jpg",
            quote: "I've tried many website builders, but this one stands out. The drag-and-drop functionality is seamless, and the templates are stunning. It saved our startup thousands in development costs.",
            author: "James Rodriguez",
            position: "Startup Founder"
        },
        {
            image: "/path/to/testimonial-3.jpg",
            quote: "As a designer, I'm impressed by the attention to detail. Every element is pixel-perfect, and the responsive design tools are best-in-class. This is the future of web design.",
            author: "Emily Chen",
            position: "UI/UX Designer"
        },
        {
            image: "/path/to/testimonial-4.jpg",
            quote: "We switched from our old platform and couldn't be happier. The performance improvements alone justify the move. Plus, the customer support team is incredibly responsive and helpful.",
            author: "Michael Thompson",
            position: "Marketing Director"
        },
        {
            image: "/path/to/testimonial-5.jpg",
            quote: "Building complex websites used to take weeks. Now, with this builder, I can create professional sites in hours. The component library and customization options are unmatched.",
            author: "Lisa Anderson",
            position: "Freelance Developer"
        }
    ];

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                backgroundColor: theme.palette.background.default,
                position: 'relative',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 4, md: 8 }
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            position: 'relative',
                            maxWidth: { xs: '100%', md: '400px' },
                        }}
                    >

                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: { xs: '300px', md: '400px' },
                                borderRadius: '20px',
                                overflow: 'hidden',
                                backgroundColor:
                                    theme.palette.mode === 'light'
                                        ? '#a8c5c5'
                                        : theme.palette.primary.lightBg,
                            }}
                        >
                            {/* The image itself */}
                            <Box
                                component="img"
                                src={testimonials[currentSlide].image}
                                alt={testimonials[currentSlide].author}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />

                            {/* Overlay content */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: '14px',
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        px: 2,
                                        py: 1,
                                        borderRadius: '8px',
                                    }}
                                >
                                    Person Image
                                </Typography>
                            </Box>
                        </Box>


                        {/* Overlay Card - Product/Feature Image */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: { xs: '40px', md: '60px' },
                                right: { xs: '-20px', md: '-40px' },
                                width: { xs: '120px', md: '160px' },
                                height: { xs: '120px', md: '160px' },
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '12px',
                                border: `6px dashed ${theme.palette.divider}`,
                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '80%',
                                    height: '80%',
                                    backgroundColor: theme.palette.mode === 'light'
                                        ? '#f0f0f0'
                                        : theme.palette.primary.bg,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        px: 1,
                                    }}
                                >
                                    Feature Image
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Testimonial Content */}
                    <Box
                        sx={{
                            flex: 1,
                            maxWidth: { xs: '100%', md: '500px' },
                            position: 'relative',
                        }}
                    >
                        {/* Label */}
                        <Typography
                            sx={{
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                color: theme.palette.text.secondary,
                                mb: 3,
                            }}
                        >
                            Success Stories
                        </Typography>

                        {/* Quote */}
                        <Box sx={{ position: 'relative', minHeight: '200px' }}>
                            {testimonials.map((testimonial, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        opacity: currentSlide === index ? 1 : 0,
                                        transition: 'opacity 0.5s ease-in-out',
                                        pointerEvents: currentSlide === index ? 'auto' : 'none',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '16px', md: '18px' },
                                            lineHeight: 1.8,
                                            color: theme.palette.text.primary,
                                            mb: 3
                                        }}
                                    >
                                        {testimonial.quote}
                                    </Typography>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: '16px',
                                                fontWeight: 700,
                                                color: theme.palette.text.primary,
                                                mb: 0.5,
                                            }}
                                        >
                                            {testimonial.author}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '14px',
                                                color: theme.palette.text.secondary,
                                            }}
                                        >
                                            {testimonial.position}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5, mt: 12, alignItems: 'center' }}>
                            {testimonials.map((_, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    sx={{
                                        width: currentSlide === index ? '32px' : '8px',
                                        height: '8px',
                                        borderRadius: '4px',
                                        backgroundColor: currentSlide === index
                                            ? theme.palette.primary.main
                                            : theme.palette.divider,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Navigation Arrow - Next */}
                    <Box
                        sx={{
                            position: { xs: 'relative', md: 'absolute' },
                            right: { xs: 'auto', md: 0 },
                            top: { xs: 'auto', md: '50%' },
                            transform: { xs: 'none', md: 'translateY(-50%)' },
                            mt: { xs: 2, md: 0 },
                        }}
                    >
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                                },
                            }}
                        >
                            <ArrowForwardIos sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 'auto', md: 0 },
                            top: { xs: 'auto', md: '50%' },
                            transform: { xs: 'none', md: 'translateY(-50%)' },
                            display: { xs: 'none', md: 'block' },
                        }}
                    >
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                border: `2px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    borderColor: theme.palette.primary.main,
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            <ArrowBackIos sx={{ fontSize: 20, ml: 0.5 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default TestimonialSection;