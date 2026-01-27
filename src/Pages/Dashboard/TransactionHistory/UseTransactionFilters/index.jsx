import { useState } from 'react';
import { createInitialFilters } from '../TransactionUtils';

export const useTransactionFilters = (onFetch) => {
    const [filters, setFilters] = useState(createInitialFilters());
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value, offset: 0 }));
        setCurrentPage(1);
    };

    const handleApplyFilters = () => {
        onFetch(filters);
    };

    const handleClearFilters = () => {
        const initialFilters = createInitialFilters();
        setFilters(initialFilters);
        setCurrentPage(1);
        setTimeout(() => onFetch({}), 100);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        const newOffset = (value - 1) * filters.limit;
        const newFilters = { ...filters, offset: newOffset };
        setFilters(newFilters);
        onFetch(newFilters);
    };

    return {
        filters,
        currentPage,
        handleFilterChange,
        handleApplyFilters,
        handleClearFilters,
        handlePageChange,
    };
};