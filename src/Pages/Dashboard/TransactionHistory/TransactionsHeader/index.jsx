import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const TransactionHeader = ({ onBack, theme }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
            }}
        >
            <Box>
                <Typography
                    variant="h3"
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    Transaction History
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    View and manage all your transactions
                </Typography>
            </Box>
            <Button
                startIcon={<ArrowBack />}
                onClick={onBack}
                sx={{
                    color: 'white',
                    borderColor: 'white',
                    border: '2px solid white',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                        bgcolor: 'white',
                        color: theme.palette.primary.main,
                        borderColor: 'white',
                    },
                }}
            >
                Back to Dashboard
            </Button>
        </Box>
    );
};

export default TransactionHeader;