import React from 'react';
import {
    CheckCircle,
    Cancel,
    Pending,
    TrendingUp,
    TrendingDown,
    SwapHoriz,
} from '@mui/icons-material';

export const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
        case 'completed':
        case 'success':
            return '#4ade80';
        case 'pending':
            return '#fbbf24';
        case 'failed':
        case 'cancelled':
            return '#f87171';
        default:
            return '#94a3b8';
    }
};

export const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
        case 'completed':
        case 'success':
            return <CheckCircle sx={{ fontSize: 18 }} />;
        case 'pending':
            return <Pending sx={{ fontSize: 18 }} />;
        case 'failed':
        case 'cancelled':
            return <Cancel sx={{ fontSize: 18 }} />;
        default:
            return <SwapHoriz sx={{ fontSize: 18 }} />;
    }
};

export const getTypeIcon = (type) => {
    const typeLower = type?.toLowerCase();
    if (typeLower?.includes('credit') || typeLower?.includes('deposit')) {
        return <TrendingUp sx={{ color: '#4ade80', fontSize: 20 }} />;
    } else if (typeLower?.includes('debit') || typeLower?.includes('withdrawal')) {
        return <TrendingDown sx={{ color: '#f87171', fontSize: 20 }} />;
    }
    return <SwapHoriz sx={{ color: '#94a3b8', fontSize: 20 }} />;
};

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatAmount = (amount, currency = 'NGN') => {
    if (!amount) return '0.00';
    return `${currency} ${Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const filterTransactions = (transactions, searchTerm) => {
    if (!searchTerm) return transactions;
    const searchLower = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
        transaction.reference?.toLowerCase().includes(searchLower) ||
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.type?.toLowerCase().includes(searchLower)
    );
};

export const createInitialFilters = () => ({
    status: '',
    type: '',
    startDate: '',
    endDate: '',
    search: '',
    limit: 20,
    offset: 0,
});