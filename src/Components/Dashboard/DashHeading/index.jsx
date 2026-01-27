import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const DashHeading = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
                    Welcome Back to Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    Manage your projects and explore new possibilities
                </Typography>
            </Box>
        </Box>
    );
};

export default DashHeading;