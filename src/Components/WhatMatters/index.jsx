import { Box, Container, Typography, useTheme } from '@mui/material';

function WhatMattersSection() {
    const theme = useTheme();

    const features = [
        {
            title: "Visual Page Builder",
            description: "Design beautiful pages with real-time editing. Add sections, customize layouts, and see changes instantly. Perfect alignment with smart guides ensures professional results every time."
        },
        {
            title: "Template Library",
            description: "Access hundreds of professionally designed templates. Start with pre-built layouts and customize them to match your brand perfectly."
        },
        {
            title: "Custom Components",
            description: "Build reusable components and save them for future projects. Create your own design system and maintain consistency across all pages."
        }
    ];

    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '32px', md: '40px' },
                            mb: 2,
                            color: theme.palette.text.heading,
                        }}
                    >
                        All the essential tools
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            color: theme.palette.text.secondary,
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Everything you need to build professional websites. From drag-and-drop editing to advanced customization, we've got you covered.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 6, md: 8 }
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            maxWidth: { xs: '100%', md: '500px' },
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {features.map((feature, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        pl: { xs: 0, md: 4 },
                                        borderLeft: {
                                            xs: 'none',
                                            md: `3px solid ${theme.palette.primary.main}`
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '18px',
                                            mb: 1.5,
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            lineHeight: 1.7,
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            component='img'
                            src='/Images/Col2.png'
                            sx={{
                                width: '100%',
                                height: { xs: '560px', md: '600px' },                              
                                objectFit: 'contain',
                            }}
                        >
                        </Box>
                    </Box>                    
                </Box>
            </Container>
        </Box>
    );
}

export default WhatMattersSection;