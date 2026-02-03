import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../Utils/ApiCall'; 
import { useLoader } from '../Context/LoaderContext'; 
import { showToast } from '../Utils/toast'; 

export const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const updateProfile = useCallback(async (updateData, userId = null, isAdmin = false) => {
        setLoading(true);
        showLoader('Updating profile...', 'dots');

        try {
            let url;
            if (isAdmin && userId) {
                url = `/V1/admin/user/profile/update/${userId}`;
            } else {
                url = '/V1/user/profile/update';
            }

            // Make API call
            const res = await apiCall(url, updateData, 'PATCH');

            console.log('Raw API Response:', res);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to update profile");
            }

            hideLoader();
            showToast.success(res?.message || 'Profile updated successfully');

            return res.result;

        } catch (err) {
            console.error("UPDATE PROFILE ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to update profile');
            }

            return null;

        } finally {
            setLoading(false);
        }
    }, [navigate, showLoader, hideLoader]);

    return { updateProfile, loading };
};