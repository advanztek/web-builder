import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../Utils/toast';
import { useLoader } from '../Context/LoaderContext';
import { apiCall } from '../Utils/ApiCall';

export const useGetPackages = () => {
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getPackages = useCallback(async () => {
        setLoading(true);
        showLoader('Loading packages...', 'dots');

        try {
            const res = await apiCall("/V1/packages/active", null, 'GET');

            console.log('Raw API Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch packages");
            }

            let packagesData = [];

            if (res.result?.data && Array.isArray(res.result.data)) {
                // If result.data is an array
                packagesData = res.result.data;
            } else if (Array.isArray(res.result)) {
                // If result itself is an array
                packagesData = res.result;
            } else if (res.result && typeof res.result === 'object') {
                // If result is a single object, wrap it in an array
                packagesData = [res.result];
            } else if (Array.isArray(res.data)) {
                // Fallback to res.data if it's an array
                packagesData = res.data;
            }

            console.log('Processed packages data:', packagesData);
            console.log('Is array?', Array.isArray(packagesData));
            console.log('Length:', packagesData.length);

            setPackages(packagesData);

            hideLoader();
            return packagesData;

        } catch (err) {
            console.error("GET PACKAGES ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load packages');
            }

            setPackages([]);
            return [];

        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { getPackages, packages, loading };
};