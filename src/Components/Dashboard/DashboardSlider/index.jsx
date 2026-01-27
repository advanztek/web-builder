import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { slides } from './data';



const DashboardSlider = () => {
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const timer = setInterval(handleNext, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: 200, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
            {slides.map((slide, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: slide.bgColor,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: currentSlide === index ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        px: 4,
                    }}
                >
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2, textAlign: 'center' }}>
                        {slide.title}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 600 }}>
                        {slide.description}
                    </Typography>
                </Box>
            ))}

            <IconButton
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
            >
                <ChevronLeft />
            </IconButton>

            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
            >
                <ChevronRight />
            </IconButton>

            <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
                {slides.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        sx={{
                            width: currentSlide === index ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default DashboardSlider;