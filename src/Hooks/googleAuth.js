import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../Context/LoaderContext";
import { showToast } from "../Utils/toast";
import { setUser } from "../Store/slices/userSlice";
import { BASE_SERVER_URL } from '../Config/url';

export const useGoogleAuthLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showLoader, hideLoader } = useLoader();

  return async (googleAccessToken) => {
    try {
      showLoader('Logging in with Google...', 'dots');

      if (!googleAccessToken) {
        throw new Error("Google access token is required");
      }

      console.log("🔵 Sending Google token to backend...");

      // ✅ FIXED: Direct fetch to backend with Google token
      const response = await fetch(`${BASE_SERVER_URL}/V1/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          google_access_token: googleAccessToken  // Send the token from popup
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google authentication failed');
      }

      const result = await response.json();
      console.log("✅ Google login response:", result);

      // Handle successful response
      if (result?.code === 0 || result?.success === true) {
        const userData = result.result || result.data || result;
        
        showToast.success(result.message || "Signed in with Google successfully!");
        
        // Store token if provided
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }
        
        // Update Redux store
        dispatch(setUser(userData));

        // Navigate based on user role
        const user = userData.user || userData;
        if (user?.role === 1 || user?.role === 2) {
          navigate("/dashboard");
        } else {
          navigate("/dashboard/user");
        }
        
        return true;
      } else {
        throw new Error(result.message || "Google authentication failed");
      }

    } catch (error) {
      console.error("❌ Google Auth Error:", error);
      showToast.error(error.message || "Google authentication failed");
      return false;
    } finally {
      hideLoader();
    }
  };
};