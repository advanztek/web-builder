import React from 'react';
import { Card, TableContainer, Table, TableBody, Box, Pagination } from '@mui/material';
import TransactionRow from '../TransactionRow';
import TransactionEmptyState from '../TransactionEmptyState';
import TransactionTableHeader from '../TransactionTableHeader';


const TransactionTable = ({
    transactions,
    loading,
    formatDate,
    formatAmount,
    currentPage,
    totalPages,
    onPageChange
}) => {
    return (
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
                <Table>
                    <TransactionTableHeader />
                    <TableBody>
                        {loading || transactions.length === 0 ? (
                            <TransactionEmptyState loading={loading} />
                        ) : (
                            transactions.map((transaction) => (
                                <TransactionRow
                                    key={transaction.id}
                                    transaction={transaction}
                                    formatDate={formatDate}
                                    formatAmount={formatAmount}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {transactions.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={onPageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Card>
    );
};

export default TransactionTable;