import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../Utils/toast';
import { useLoader } from '../Context/LoaderContext';
import { apiCall } from '../Utils/ApiCall';

// Hook to get credit value
export const useGetCreditValue = () => {
    const [loading, setLoading] = useState(false);
    const [creditValue, setCreditValue] = useState(null);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getCreditValue = useCallback(async () => {
        setLoading(true);
        showLoader('Loading credit value...', 'dots');

        try {
            const res = await apiCall("/V1/admin/credit/value", null, 'GET');

            console.log('Raw API Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch credit value");
            }

            let valueData = null;

            if (res.result && Array.isArray(res.result) && res.result.length > 0) {
                // If result is an array, take the first item
                valueData = res.result[0];
            } else if (res.result && typeof res.result === 'object' && !Array.isArray(res.result)) {
                // If result is a single object
                valueData = res.result;
            } else if (res.data && typeof res.data === 'object') {
                // Fallback to res.data
                valueData = res.data;
            }

            console.log('Processed credit value:', valueData);
  hideLoader();
            setCreditValue(valueData);
          
            return valueData;

        } catch (err) {
            console.error("GET CREDIT VALUE ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load credit value');
            }

            setCreditValue(null);
            return null;

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { getCreditValue, creditValue, loading };
};

// Hook to assign/update credit value
export const useAssignCreditValue = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const assignCreditValue = useCallback(async (value) => {
        setLoading(true);
        showLoader('Updating credit value...', 'dots');

        try {
            const res = await apiCall("/V1/admin/credit/assign-value", { value }, 'POST');

            console.log('Raw API Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to update credit value");
            }

            hideLoader();
            showToast.success(res?.message || 'Credit value updated successfully');

            return res.result;

        } catch (err) {
            console.error("ASSIGN CREDIT VALUE ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to update credit value');
            }

            return null;

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { assignCreditValue, loading };
};