import React from 'react';
import { Box, Container, Fade, useTheme } from '@mui/material';
import { useTransactionHistory } from './UseTransactionHistory';
import TransactionLoadingSpinner from './TransactionLoadingSpinner';
import FilterCard from './FilterCard';
import TransactionTable from './TransactionsTable';
import TransactionsHeader from './TransactionsHeader';
import TransactionHeader from './TransactionsHeader';

const TransactionHistoryPage = () => {
    const theme = useTheme();
    const {
        transactions,
        loading,
        filters,
        currentPage,
        totalPages,
        handleFilterChange,
        handleApplyFilters,
        handleClearFilters,
        handlePageChange,
        handleBack,
        formatDate,
        formatAmount,
    } = useTransactionHistory();

    if (loading && transactions.length === 0) {
        return <TransactionLoadingSpinner />;
    }

    return (
        <Box sx={{ minHeight: '100vh', pt: 8, pb: 8 }}>
            <Container maxWidth="lg">
                <Fade in timeout={600}>
                    <Box sx={{ mt: 7, mb: 6 }}>
                        <TransactionHeader onBack={handleBack} theme={theme} />

                        <FilterCard
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onApply={handleApplyFilters}
                            onClear={handleClearFilters}
                            theme={theme}
                        />

                        <TransactionTable
                            transactions={transactions}
                            loading={loading}
                            formatDate={formatDate}
                            formatAmount={formatAmount}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default TransactionHistoryPage;