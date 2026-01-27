import React from 'react';
import { Box, Typography } from '@mui/material';
import { TouchApp } from '@mui/icons-material';

const EmptySelectionState = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                px: 2,
                textAlign: 'center',
            }}
        >
            <TouchApp sx={{ fontSize: 48, color: '#667eea', mb: 2, opacity: 0.6 }} />
            <Typography variant="body2" sx={{ color: '#a0a0a0', mb: 0.5 }}>
                No element selected
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', maxWidth: 200 }}>
                Click on any element in the canvas to edit its properties
            </Typography>
        </Box>
    );
};

export default EmptySelectionState;