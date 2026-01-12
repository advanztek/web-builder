import React from 'react';
import {
    Box,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    useTheme,
} from '@mui/material';
import {
    LightMode,
    DarkMode,
    Logout,
} from '@mui/icons-material';
import { useThemeContext } from '../../Context';
import { Person20Regular, Search20Regular } from '@fluentui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardNav = () => {
    const { mode, toggleTheme } = useThemeContext();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const isEditorView = location.pathname.includes('/editor');

    // Don't render header if in editor view
    if (isEditorView) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: '0',
                right: 0,
                height: '66px',
                bgcolor: theme.palette.background.paper,
                // borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                zIndex: 1200,
            }}
        >
            {/* Dashboard View - Left Side */}
            <TextField
                placeholder="Search projects..."
                size="small"
                sx={{
                    maxWidth: '400px',
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                        bgcolor: theme.palette.action.hover,
                        '& fieldset': {
                            border: 'none',
                        },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search20Regular style={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Dashboard View - Right Side */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton
                    onClick={toggleTheme}
                    sx={{
                        color: theme.palette.text.secondary,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: theme.palette.primary.main,
                            bgcolor: theme.palette.action.hover,
                            transform: 'rotate(180deg)',
                        },
                    }}
                >
                    {mode === 'dark' ? <LightMode sx={{ fontSize: 24 }} /> : <DarkMode sx={{ fontSize: 24 }} />}
                </IconButton>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText,
                        textTransform: 'none',
                        px: 2,
                        fontWeight: 600,
                        gap: 1,
                        '&:hover': {
                            bgcolor: theme.palette.primary.main,
                        },
                    }}
                >
                    <Person20Regular />
                    Profile
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: theme.palette.error.main,
                        color: theme.palette.common.white,
                        textTransform: 'none',
                        px: 2,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                            bgcolor: theme.palette.error.dark,
                        },
                    }}
                >
                    <Logout fontSize="small" />
                    Logout
                </Button>
            </Box>
        </Box>
    );
};

export default DashboardNav;