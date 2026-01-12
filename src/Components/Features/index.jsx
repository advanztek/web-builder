import { Box, Container, Typography, Grid, useTheme } from '@mui/material';

function FeaturesSection() {
    const theme = useTheme();

    const features = [
        {
            title: "Drag & Drop Builder",
            description: "Create stunning websites with our intuitive drag and drop interface. No coding required - simply select, drag, and place elements exactly where you want them.",
            color: '#ef5350', 
        },
        {
            title: "Responsive Design",
            description: "Your website automatically adapts to any screen size. Build once and deliver perfect experiences on desktop, tablet, and mobile devices seamlessly.",
            color: '#ffa726', 
        },
        {
            title: "Fast Performance",
            description: "Lightning-fast loading times guaranteed. Our optimized infrastructure ensures your website delivers exceptional speed and performance for every visitor.",
            color: '#42a5f5', 
        }
    ];

    return (
        <Box 
            sx={{ 
                py: { xs: 8, md: 12 },
                backgroundColor: theme.palette.background.default,
            }}
        >
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs:12, md:4 }} key={index}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    px: 2,
                                }}
                            >
                                
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        margin: '0 auto 24px',
                                        borderRadius: '50%',
                                        backgroundColor: feature.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            width: 40,
                                            height: 40,
                                            backgroundColor: theme.palette.background.paper,
                                            borderRadius: '8px',
                                        }
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '18px',
                                        mb: 2,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {feature.title}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        lineHeight: 1.7,
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
        </Box>
    );
}

export default FeaturesSection;