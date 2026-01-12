import React from 'react'
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import { features } from './data';



const FeaturesH = () => {

    return (
        <>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                        Powerful Features
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#888', maxWidth: 600, mx: 'auto' }}>
                        Everything you need to build, deploy, and scale modern applications
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid size={{xs:12, md:4 }}  key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    backgroundColor: '#111',
                                    border: '1px solid #222',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderColor: '#4A9EFF',
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 24px rgba(74, 158, 255, 0.2)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ color: '#4A9EFF', mb: 2 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography sx={{ color: '#aaa' }}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}

export default FeaturesH
