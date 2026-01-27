import React from 'react';
import { TableRow, TableCell, Typography, CircularProgress } from '@mui/material';

const TransactionEmptyState = ({ loading, colspan = 6 }) => {
    if (loading) {
        return (
            <TableRow>
                <TableCell colSpan={colspan} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                </TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow>
            <TableCell colSpan={colspan} align="center" sx={{ py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                    No transactions found
                </Typography>
            </TableCell>
        </TableRow>
    );
};

export default TransactionEmptyState;