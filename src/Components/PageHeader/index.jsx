import React from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const PageHeader = ({
    title,
    subtitle,
    onBack,
    buttonText = "Back to Dashboard",
    theme
}) => {
    return (
        <Fade in timeout={600}>
            <Box sx={{ textAlign: 'start', mt: 7, mb: 8 }}>
                <Typography
                    variant="h2"
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: '1rem', md: '1.5rem' },
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 4,
                    }}
                >
                    {subtitle}
                </Typography>

                <Button
                    startIcon={<ArrowBack />}
                    onClick={onBack}
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
                    {buttonText}
                </Button>
            </Box>
        </Fade>
    );
};

export default PageHeader;