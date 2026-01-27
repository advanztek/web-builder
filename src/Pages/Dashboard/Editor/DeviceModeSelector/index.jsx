import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Computer, Tablet, Smartphone } from '@mui/icons-material';

const DeviceModeSelector = ({ deviceMode, onDeviceChange }) => {
    const devices = [
        { name: 'Desktop', icon: Computer },
        { name: 'Tablet', icon: Tablet },
        { name: 'Mobile', icon: Smartphone },
    ];

    return (
        <Box sx={{
            display: 'flex',
            gap: 1,
            mr: 2,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: 1,
            p: 0.5
        }}>
            {devices.map(({ name, icon: Icon }) => (
                <Tooltip key={name} title={`${name} View`}>
                    <IconButton
                        size="small"
                        onClick={() => onDeviceChange(name)}
                        sx={{
                            color: deviceMode === name ? '#667eea' : 'white',
                            bgcolor: deviceMode === name ? 'white' : 'transparent'
                        }}
                    >
                        <Icon />
                    </IconButton>
                </Tooltip>
            ))}
        </Box>
    );
};

export default DeviceModeSelector;