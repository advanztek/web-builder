import React from 'react';
import { Chip } from '@mui/material';

const PopularBadge = ({ theme }) => {
    return (
        <Chip
            label="MOST POPULAR"
            sx={{
                position: 'absolute',
                top: 20,
                right: -10,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.5px',
                transform: 'rotate(10deg)',
                zIndex: 1,
            }}
        />
    );
};

export default PopularBadge;