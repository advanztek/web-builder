import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTransactions } from '../../../../Hooks/transaction';
import { useTransactionFilters } from '../UseTransactionFilters';
import { filterTransactions, formatDate, formatAmount } from '../TransactionUtils';

export const useTransactionHistory = () => {
    const navigate = useNavigate();
    const { getTransactions, transactions, loading, pagination } = useGetTransactions();

    const fetchTransactions = async (filterParams = {}) => {
        await getTransactions({
            status: filterParams.status,
            type: filterParams.type,
            startDate: filterParams.startDate,
            endDate: filterParams.endDate,
            limit: filterParams.limit || 20,
            offset: filterParams.offset || 0,
        });
    };

    const {
        filters,
        currentPage,
        handleFilterChange,
        handleApplyFilters,
        handleClearFilters,
        handlePageChange,
    } = useTransactionFilters(fetchTransactions);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filteredTransactions = useMemo(
        () => filterTransactions(transactions, filters.search),
        [transactions, filters.search]
    );

    const totalPages = Math.ceil((pagination.total || 0) / filters.limit);

    const handleBack = () => {
        navigate('/dashboard');
    };

    return {
        transactions: filteredTransactions,
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
    };
};