import { useState } from 'react';
import { apiCall } from '../Utils/ApiCall';

const usePaymentInitialize = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializePayment = async (payload) => {
    const packageId = payload?.packageId;

    if (!packageId) {
      throw new Error('Package ID is required to initialize payment');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Initializing payment with payload:', payload);

      const response = await apiCall('/V1/payment/initialize', {
        package_id: String(packageId),
        credits: payload?.credits
          ? String(payload.credits)
          : undefined,
        amount: payload?.amount
          ? String(payload.amount)
          : undefined,
      });

      console.log('Payment response:', response);

      if (response?.success && response?.data?.authorization_url) {
        window.location.href =
          response.data.authorization_url;
        return response;
      }

      throw new Error(
        response?.message ||
          'Invalid server response from payment gateway'
      );
    } catch (err) {
      console.error('Payment init error:', err);
      setError(err.message || 'Payment initialization failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    initializePayment,
    loading,
    error,
  };
};

export default usePaymentInitialize;

