import React from 'react';
import { Button } from '@mui/material';

const BuyButton = ({ onClick, color, theme }) => {
    return (
        <Button
            variant="contained"
            fullWidth
            onClick={onClick}
            sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: `linear-gradient(135deg, 
                ${color} 0%, ${theme.palette.primary.dark} 100%)`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 10px 20px ${color}40`,
                },
            }}
        >
            Buy Now
        </Button>
    );
};

export default BuyButton;