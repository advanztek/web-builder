import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ message = "No packages available at the moment" }) => {
    return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="white">
                {message}
            </Typography>
        </Box>
    );
};

export default EmptyState;