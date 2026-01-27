import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

const PaymentBtn = ({
    onClick,
    amount,
    isProcessing,
    isLoading
}) => {
    const disabled = isProcessing || isLoading;

    return (
        <Box sx={{ mt: 4 }}>
            <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={disabled}
                onClick={onClick}
                startIcon={
                    disabled ? (
                        <CircularProgress size={20} />
                    ) : (
                        <ShoppingCart />
                    )
                }
                sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #07175eff 0%, #000000ff 100%)',
                }}
            >
                {disabled ? 'Processing...' : `Pay ₦${amount}`}
            </Button>
        </Box>
    );
};

export default PaymentBtn;