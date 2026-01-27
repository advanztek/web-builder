import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../Context/LoaderContext';
import { showToast } from '../Utils/toast';
import { apiCall } from '../Utils/ApiCall';

export const useGetTransactions = () => {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ offset: 0, limit: 20, total: 0 });
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getTransactions = async (filters = {}) => {
        setLoading(true);
        showLoader('Loading transactions...', 'dots');

        try {
            const queryParams = new URLSearchParams();
            
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.startDate) queryParams.append('start_date', filters.startDate);
            if (filters.endDate) queryParams.append('end_date', filters.endDate);
            if (filters.limit) queryParams.append('limit', filters.limit);
            if (filters.offset) queryParams.append('offset', filters.offset);

            const queryString = queryParams.toString();
            const endpoint = `/V1/user/transactions${queryString ? `?${queryString}` : ''}`;
            
            const res = await apiCall(endpoint, null, 'GET');
            
            console.log('Raw API Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch transactions");
            }

            let transactionsData = [];
            let paginationData = { offset: 0, limit: 20, total: 0 };

            // Handle different response structures
            if (res.result?.data && Array.isArray(res.result.data)) {
                transactionsData = res.result.data;
                paginationData = res.result.pagination || paginationData;
            } else if (Array.isArray(res.result)) {
                transactionsData = res.result;
            } else if (res.data && Array.isArray(res.data)) {
                transactionsData = res.data;
            }

            console.log('Processed transactions:', transactionsData);
            
            setTransactions(transactionsData);
            setPagination(paginationData);
            
            hideLoader();
            return { transactions: transactionsData, pagination: paginationData };

        } catch (err) {
            console.error("GET TRANSACTIONS ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load transactions');
            }

            setTransactions([]);
            return { transactions: [], pagination: { offset: 0, limit: 20, total: 0 } };

        } finally {
            setLoading(false);
        }
    };

    return { getTransactions, transactions, loading, pagination };
};                      