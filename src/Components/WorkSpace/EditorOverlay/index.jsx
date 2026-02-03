import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';


export function EditorOverlay({ projectName }) {
    return (
        <Box sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            flexDirection: 'column',
            gap: 2,
        }}>
            <CircularProgress size={60} sx={{ color: '#667eea' }} />
            <Typography variant="h6" color="#e0e0e0">
                Initializing editor…
            </Typography>
            <Typography variant="body2" color="#808080">
                {projectName}
            </Typography>
        </Box>
    );
}