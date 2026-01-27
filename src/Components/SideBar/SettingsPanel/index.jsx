import React from 'react';
import { Box, Typography } from '@mui/material';

export const SettingsPanel = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        <Typography color="text.secondary">
            Manage account preferences, security, notifications, and system settings.
        </Typography>
    </Box>
);