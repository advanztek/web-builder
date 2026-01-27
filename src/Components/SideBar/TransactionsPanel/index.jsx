import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { Receipt, ArrowForward } from '@mui/icons-material';

export const TransactionsPanel = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate('/dashboard/transactions')}
            sx={{
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                m:2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.main,
                },
            }}
        >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        margin: '0 auto 16px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                    }}
                >
                    <Receipt sx={{ fontSize: 32, color: theme.palette.primary.contrastText }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}>
                    Transaction History
                </Typography>

                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                    View all your payment transactions and billing history
                </Typography>

                <ArrowForward sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            </CardContent>
        </Card>
    );
};