import React from 'react';
import { TableRow, TableCell, Typography } from '@mui/material';
import { Percent as PercentIcon, Add as AddIcon } from '@mui/icons-material';
import { GradientButton } from '../styles';

const EmptyState = ({ onCreateClick }) => {
    return (
        <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                <PercentIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    No coupons found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Create your first coupon to get started
                </Typography>
                <GradientButton
                    startIcon={<AddIcon />}
                    onClick={onCreateClick}
                >
                    Create Coupon
                </GradientButton>
            </TableCell>
        </TableRow>
    );
};

export default EmptyState;