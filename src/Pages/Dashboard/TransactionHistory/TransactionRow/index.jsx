import React from 'react';
import { TableRow, TableCell, Box, Typography, Chip } from '@mui/material';
import { getTypeIcon, getStatusIcon, getStatusColor } from '../TransactionUtils';

const TransactionRow = ({ transaction, formatDate, formatAmount }) => {
    return (
        <TableRow
            sx={{
                '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.05)',
                },
            }}
        >
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(transaction.type)}
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            textTransform: 'capitalize',
                        }}
                    >
                        {transaction.type}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {transaction.reference || 'N/A'}
                </Typography>
            </TableCell>

            <TableCell>
                <Typography variant="body2">
                    {transaction.description || 'No description'}
                </Typography>
            </TableCell>

            <TableCell>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 700,
                        color: transaction.type?.toLowerCase().includes('credit')
                            ? '#4ade80'
                            : '#f87171',
                    }}
                >
                    {formatAmount(transaction.amount, transaction.currency)}
                </Typography>
            </TableCell>

            <TableCell>
                <Chip
                    icon={getStatusIcon(transaction.status)}
                    label={transaction.status}
                    sx={{
                        bgcolor: getStatusColor(transaction.status),
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                    }}
                />
            </TableCell>

            <TableCell>
                <Typography variant="body2">
                    {formatDate(transaction.created_at)}
                </Typography>
            </TableCell>
        </TableRow>
    );
};

export default TransactionRow;