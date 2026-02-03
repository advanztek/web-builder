import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '../Context/LoaderContext';
import { showToast } from '../Utils/toast';
import { apiCall } from '../Utils/ApiCall';

// CREATE COUPON
export const useCreateCoupon = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const createCoupon = async (couponData) => {
        setLoading(true);
        showLoader('Creating coupon...', 'dots');

        try {
            const res = await apiCall('/V1/admin/coupon/create', couponData, 'POST');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to create coupon");
            }

            hideLoader();
            showToast.success('Coupon created successfully!');
            return res.result;

        } catch (err) {
            console.error("CREATE COUPON ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to create coupon');
            }

            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { createCoupon, loading };
};

// UPDATE COUPON
export const useUpdateCoupon = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const updateCoupon = async (couponId, couponData) => {
        setLoading(true);
        showLoader('Updating coupon...', 'dots');

        try {
            const res = await apiCall(`/V1/admin/coupon/update/${couponId}`, couponData, 'PATCH');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to update coupon");
            }

            hideLoader();
            showToast.success('Coupon updated successfully!');
            return res.result;

        } catch (err) {
            console.error("UPDATE COUPON ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to update coupon');
            }

            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { updateCoupon, loading };
};

// GET ALL COUPONS
export const useGetCoupons = () => {
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [pagination, setPagination] = useState({ offset: 0, limit: 10, total: 0 });
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const getCoupons = async (filters = {}) => {
        setLoading(true);
        showLoader('Loading coupons...', 'dots');

        try {
            const queryParams = new URLSearchParams();

            if (filters.status !== undefined) queryParams.append('status', filters.status);
            if (filters.discount_type) queryParams.append('discount_type', filters.discount_type);
            if (filters.search) queryParams.append('search', filters.search);

            const limit = filters.limit || 10;
            const offset = filters.offset || 0;
            queryParams.append('limit', limit);
            queryParams.append('offset', offset);

            const queryString = queryParams.toString();
            const endpoint = `/V1/admin/coupons${queryString ? `?${queryString}` : ''}`;

            const res = await apiCall(endpoint, null, 'GET');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch coupons");
            }

            let couponsData = [];
            let paginationData = { offset: 0, limit: 10, total: 0 };

            // Handle different response structures
            if (res.result?.data && Array.isArray(res.result.data)) {
                couponsData = res.result.data;
                paginationData = res.result.pagination || paginationData;
            } else if (Array.isArray(res.result)) {
                couponsData = res.result;
            } else if (res.data && Array.isArray(res.data)) {
                couponsData = res.data;
            }

            setCoupons(couponsData);
            setPagination(paginationData);

            hideLoader();
            return { coupons: couponsData, pagination: paginationData };

        } catch (err) {
            console.error("GET COUPONS ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to load coupons');
            }

            setCoupons([]);
            return { coupons: [], pagination: { offset: 0, limit: 10, total: 0 } };

        } finally {
            setLoading(false);
        }
    };

    return { getCoupons, coupons, loading, pagination };
};

// DELETE COUPON
export const useDeleteCoupon = () => {
    const [loading, setLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const deleteCoupon = async (couponId) => {
        setLoading(true);
        showLoader('Deleting coupon...', 'dots');

        try {
            const res = await apiCall(`/V1/admin/coupon/delete/${couponId}`, null, 'DELETE');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to delete coupon");
            }

            hideLoader();
            showToast.success('Coupon deleted successfully!');
            return res.result;

        } catch (err) {
            console.error("DELETE COUPON ERROR:", err);
            hideLoader();

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to delete coupon');
            }

            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { deleteCoupon, loading };
};

// TOGGLE COUPON STATUS
export const useToggleCouponStatus = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleStatus = async (couponId, currentStatus) => {
        setLoading(true);

        try {
            const res = await apiCall(
                `/V1/admin/coupon/toggle-status/${couponId}`,
                { status: !currentStatus },
                'PATCH'
            );

            if (!res?.success) {
                throw new Error(res?.message || "Failed to toggle coupon status");
            }

            showToast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            return res.result;

        } catch (err) {
            console.error("TOGGLE COUPON STATUS ERROR:", err);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else {
                showToast.error(err.message || 'Failed to toggle coupon status');
            }

            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { toggleStatus, loading };
};

export const useGetCouponData = (couponId, mode = 'view') => {
    const [couponData, setCouponData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if ((mode === 'edit' || mode === 'view') && couponId) {
            fetchCouponData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [couponId, mode]);

    const fetchCouponData = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await apiCall(`/V1/admin/coupons?offset=0&limit=100`, null, 'GET');

            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch coupon data");
            }

            // Handle different response structures
            const coupons = res.result || res.data || [];

            // Find the specific coupon by ID
            const coupon = Array.isArray(coupons)
                ? coupons.find(c => c.id === parseInt(couponId) || c.id === couponId)
                : null;

            if (!coupon) {
                throw new Error('Coupon not found');
            }

            setCouponData(coupon);

        } catch (err) {
            console.error("GET COUPON DATA ERROR:", err);

            const errorMessage = err.message || 'Failed to load coupon data';
            setError(errorMessage);

            if (err.message?.includes('Unauthorized')) {
                showToast.error('Session expired. Please log in again.');
                navigate('/login');
            } else if (err.message?.includes('not found')) {
                showToast.error('Coupon not found');
                navigate('/dashboard/coupons');
            } else {
                showToast.error(errorMessage);
            }

        } finally {
            setLoading(false);
        }
    };

    return { couponData, loading, error, refetch: fetchCouponData };
};