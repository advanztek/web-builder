import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../Utils/toast';
import { BASE_SERVER_URL } from '../Config/url';

// Utility function for API calls
const apiCall = async (endpoint, data, method = 'POST', contentType = 'application/json') => {
  const options = {
    method,
    headers: { 'Content-Type': contentType },
  };

  if (contentType === 'application/json') {
    options.body = JSON.stringify(data);
  } else if (contentType === 'application/x-www-form-urlencoded') {
    options.body = new URLSearchParams(data);
  }

  const response = await fetch(`${BASE_SERVER_URL}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (data) => {
    setLoading(true);

    try {
      const res = await apiCall("/auth/register", data);

      if (!res?.success) {
        throw new Error(res?.message || "Registration failed");
      }

      // ✅ Request OTP explicitly
      await apiCall("/auth/req-verify-otp", {
        email: data.email,
      });

      showToast.success("Registration successful! OTP sent to your email.");
      navigate("/verify-email", { state: { email: data.email } });

      return res.result?.[0] ?? null;
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      const response = err?.response;
      const status = response?.status;
      const payload = response?.data;

      if (status === 422) {
        if (Array.isArray(payload?.errors)) {
          payload.errors.forEach((e) =>
            showToast.error(e?.message || "Validation error")
          );
        } else {
          showToast.error(payload?.message);
        }
        return;
      }

      if (status === 409) {
        showToast.error(payload?.message || "Email already exists");
        return;
      }

      showToast.error(
        payload?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (data) => {
    setLoading(true);
    try {
      const result = await apiCall('/auth/login', data);

      localStorage.setItem('token', result.result.token);
      localStorage.setItem('user', JSON.stringify(result.result.user));

      showToast.success(result.message || 'Login successful!');
      navigate('/dashboard');

      return result.result;
    } catch (error) {
      showToast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = () => {
    setLoading(true);
    window.location.href = `${BASE_SERVER_URL}/auth/google`;
  };

  return { loginWithGoogle, loading };
};

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async (data) => {
    setLoading(true);

    try {
      const res = await apiCall(
        "/auth/verify-email",
        data,
        "POST",
        "application/x-www-form-urlencoded"
      );

      console.log("VERIFY EMAIL RESPONSE:", res);

      if (res?.success) {
        showToast.success(res.message || "Email verified successfully!");
        navigate("/login");
        return res;
      }

      showToast.error(res?.message || "Invalid verification code");
      return null;
    } catch (err) {
      console.error("VERIFY EMAIL ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Verification failed. Please check your OTP.";

      showToast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verifyEmail, loading };
};

export const useRequestVerifyOTP = () => {
  const [loading, setLoading] = useState(false);

  const requestOTP = async (email) => {
    setLoading(true);
    try {
      const result = await apiCall('/auth/req-verify-otp', { email });
      showToast.success(result.message || 'OTP sent to your email!');
      return result;
    } catch (error) {
      showToast.error(error.message || 'Failed to send OTP. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { requestOTP, loading };
};

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const result = await apiCall('/auth/forgot-password', { email });
      showToast.success(result.message || 'Password reset link sent to your email!');
      navigate('/forgot-password-confirmation');
      return result;
    } catch (error) {
      showToast.error(error.message || 'Failed to send reset link. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
};

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = async (data) => {
    setLoading(true);
    try {
      const result = await apiCall('/auth/reset-password', data);
      showToast.success(result.message || 'Password reset successful!');
      navigate('/login');
      return result.result;
    } catch (error) {
      showToast.error(error.message || 'Password reset failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast.success('Logged out successfully!');
    navigate('/login');
  };

  return { logout };
};

export const useCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const useIsAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};