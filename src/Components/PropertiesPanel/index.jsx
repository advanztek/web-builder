import React from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Divider
} from '@mui/material';
import {
    Settings,
} from '@mui/icons-material';

export const PropertiesPanel = () => {
    const activeProjectId = useSelector(state => state.projects.activeProjectId);
    const project = useSelector(state =>
        activeProjectId ? state.projects.projects[activeProjectId] : null
    );

    return (
        <Box
            sx={{
                width: 320,
                bgcolor: '#141924',
                borderLeft: '1px solid #2a2a2a',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                color: '#e0e0e0',
                overflowY: 'auto'
            }}
        >
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                borderBottom: '1px solid #2a2a2a'
            }}>
                <Settings sx={{ color: '#1976d2' }} />
                <Typography variant="h6" fontWeight="600" sx={{ color: '#e0e0e0' }}>
                    Properties
                </Typography>
            </Box>

            {/* Selectors Section */}
            <Box sx={{ p: 2, borderBottom: '1px solid #2a2a2a' }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: '#b0b0b0',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    Selectors
                </Typography>
                <Box id="gjs-selectors" />
            </Box>

            {/* Traits Section */}
            <Box sx={{ p: 2, borderBottom: '1px solid #2a2a2a' }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: '#b0b0b0',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    Traits
                </Typography>
                <Box id="gjs-traits" />
            </Box>

            {/* Styles Section */}
            <Box sx={{ p: 2, flex: 1 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: '#b0b0b0',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    Styles
                </Typography>
                <Box
                    id="gjs-styles"
                    sx={{
                        '& .gjs-sm-sector': {
                            marginBottom: 1
                        }
                    }}
                />
            </Box>

            <Divider sx={{ borderColor: '#2a2a2a' }} />

            {/* Layers Section */}
            <Box sx={{ p: 2, maxHeight: 300, overflowY: 'auto' }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: '#b0b0b0',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    }}
                >
                    Layers
                </Typography>
                <Box id="gjs-layers" />
            </Box>

            {/* Empty State */}
            {!project && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#808080' }}>
                        Select an element to edit its properties
                    </Typography>
                </Box>
            )}
        </Box>
    );
};