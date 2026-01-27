import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Folder, Refresh } from '@mui/icons-material';

const EmptyProjectsState = ({ filter, onRefresh, loading }) => {
    const theme = useTheme();

    const getMessage = () => {
        if (filter === 'all') return 'No projects yet. Create your first project to get started!';
        if (filter === 'published') return 'No published projects yet.';
        return 'No favorite projects yet.';
    };

    return (
        <Box sx={{ mt: 6, textAlign: 'center', py: 8 }}>
            <Folder sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {getMessage()}
            </Typography>
            <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={onRefresh}
                sx={{ mt: 2 }}
                disabled={loading}
            >
                {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
        </Box>
    );
};

export default EmptyProjectsState;