import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ slug }) => {
    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            bgcolor: '#0d0d0d'
        }}>
            <CircularProgress size={60} sx={{ color: '#667eea' }} />
            <Typography variant="h6" color="#e0e0e0">
                Loading project...
            </Typography>
            <Typography variant="body2" color="#808080">
                {slug}
            </Typography>
        </Box>
    );
};

export default LoadingScreen;