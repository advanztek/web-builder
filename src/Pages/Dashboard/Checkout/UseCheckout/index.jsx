import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { calculateDiscountedTotal, extractCheckoutParams } from '../CheckoutUtils';
// import { useCoupon } from './useCoupon';
import { usePayment } from '../UsePayment';

export const useCheckout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { credits, price, packageId } = extractCheckoutParams(searchParams);

    const [formData, setFormData] = useState({ couponCode: '' });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // const { discount, couponApplied, applyCoupon } = useCoupon();
    const { processing, initLoading, processPayment } = usePayment();

    useEffect(() => {
        console.log('CHECKOUT PARAMS:', {
            credits,
            price,
            packageId,
            fullUrl: window.location.href,
        });
    }, [credits, price, packageId]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleInputChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    // const handleApplyCoupon = () => {
    //     applyCoupon(
    //         formData.couponCode,
    //         (discountPercent) => showSnackbar(`Coupon applied! ${discountPercent}% discount added.`),
    //         () => showSnackbar('Invalid coupon code.', 'error')
    //     );
    // };

    const calculateTotal = useMemo(
        () => calculateDiscountedTotal(price, discount),
        [price, discount]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await processPayment(
            packageId,
            credits,
            calculateTotal,
            (message) => showSnackbar(message, 'error')
        );
    };

    const handleBack = () => {
        navigate('/dashboard/buy-credits');
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return {
        credits,
        price,
        packageId,
        formData,
        processing,
        // discount,
        // couponApplied,
        snackbar,
        initLoading,
        calculateTotal,
        handleInputChange,
        // handleApplyCoupon,
        handleSubmit,
        handleBack,
        handleCloseSnackbar,
    };
};