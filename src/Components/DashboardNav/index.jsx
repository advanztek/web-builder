import React from 'react';
import {
    Box,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    useTheme,
    Typography,
    Card,
    Container,
} from '@mui/material';
import {
    Logout,
    ShoppingCart,
    AccountBalanceWallet,
} from '@mui/icons-material';
import { useThemeContext } from '../../Context';
import { Person20Regular, Search20Regular } from '@fluentui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../Hooks/auth';

const DashboardNav = () => {
    // const { mode, toggleTheme } = useThemeContext();
    const theme = useTheme();
    const creditBalance = 120;

    const handleBuyCredits = () => {
        navigate('/dashboard/credits');
    };
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useLogout();

    const isEditorView = location.pathname.includes('/editor');

    if (isEditorView) {
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    const handleProfile = () => {
        navigate('/dashboard/profile');
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: '0',
                right: 0,
                height: '66px',
                bgcolor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              
                zIndex: 1200,
            }}
        >
            <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography onClick={() => navigate('/dashboard')} sx={{ cursor: 'pointer', fontWeight: 700, fontSize: '1.5rem' }}>WEB BUILDER</Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Card sx={{ px: 1.5, py: 1, bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, cursor: 'pointer' }} onClick={handleBuyCredits}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <AccountBalanceWallet color="primary" />
                            <Box>
                                <Typography onClick={handleBuyCredits} variant="h6" fontWeight={600}>
                                    {creditBalance} Credits
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/dashboard/credits')}
                        startIcon={<ShoppingCart />}
                        sx={{ height: 'fit-content' }}
                    >
                        Buy Credits
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleProfile}
                        sx={{
                            border: '3px solid',
                            borderColor: theme.palette.primary.main,
                            borderRadius: '50%',
                            color: theme.palette.primary.main,
                            bgcolor: 'transparent',
                            minWidth: '44px',
                            width: '44px',
                            height: '44px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                border: '3px solid',
                                borderColor: theme.palette.primary.dark,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                transform: 'scale(1.1)',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            },
                        }}
                    >
                        <Person20Regular />
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleLogout}
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
            </Container>
        </Box>
    );
};

export default DashboardNav;