import React from 'react';
import { Box, Typography } from '@mui/material';

export const DocsPanel = () => (
    <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Documentation</Typography>
        <Typography color="text.secondary">
            Access platform guides, API docs, tutorials, and FAQs.
        </Typography>
        <ul>
            <li>Getting Started</li>
            <li>API Reference</li>
            <li>Billing & Payments</li>
            <li>Domain Management</li>
        </ul>
    </Box>
);