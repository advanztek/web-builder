import { useState } from 'react';
import usePaymentInitialize from '../../../../Hooks/payments';

export const usePayment = () => {
    const { initializePayment, loading: initLoading } = usePaymentInitialize();
    const [processing, setProcessing] = useState(false);

    const processPayment = async (packageId, credits, amount, onError) => {
        if (!packageId) {
            onError('Package ID is missing. Please go back and select a package again.');
            return;
        }

        setProcessing(true);

        try {
            console.log('Initializing payment for package:', packageId);
            await initializePayment({
                packageId,
                credits,
                amount,
            });
        } catch (err) {
            console.error(err);
            onError(err?.message || 'Payment initialization failed');
        } finally {
            setProcessing(false);
        }
    };

    return {
        processing,
        initLoading,
        processPayment,
    };
};