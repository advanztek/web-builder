// Utils/googleAuth.js
import { BASE_SERVER_URL } from "../Config/url";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Initialize Google Sign-In
 */
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    // Check if script already loaded
    if (window.google && window.google.accounts) {
      resolve(window.google);
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts) {
        resolve(window.google);
      } else {
        reject(new Error("Google Sign-In failed to load"));
      }
    };
    script.onerror = () =>
      reject(new Error("Failed to load Google Sign-In script"));
    document.head.appendChild(script);
  });
};

/**
 * Handle Google Sign-In with Popup
 * Returns the Google access token
 */
export const signInWithGooglePopup = async () => {
  try {
    await initializeGoogleAuth();

    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: (response) => {
          if (response?.access_token) {
            console.log("✅ Google access token received");
            resolve(response.access_token);
          } else {
            console.error("❌ No access token in response");
            reject(new Error("Failed to obtain Google access token"));
          }
        },
        error_callback: (error) => {
          console.error("❌ Google Popup Error:", error);
          reject(error);
        }
      });

      client.requestAccessToken();
    });
  } catch (error) {
    console.error("❌ Google initialization error:", error);
    throw error;
  }
};

/**
 * Handle Google Sign-In with One-Tap
 */
export const signInWithGoogleOneTap = async (onSuccess, onError) => {
  try {
    await initializeGoogleAuth();

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const userObject = parseJwt(response.credential);

          onSuccess({
            credential: response.credential,
            user: {
              email: userObject.email,
              firstName: userObject.given_name,
              lastName: userObject.family_name,
              fullName: userObject.name,
              picture: userObject.picture,
              googleId: userObject.sub
            }
          });
        } catch (error) {
          onError(error);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log(
          "One-Tap not displayed:",
          notification.getNotDisplayedReason()
        );
      }
    });
  } catch (error) {
    onError(error);
  }
};

/**
 * Parse JWT token
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    throw new Error("Invalid token");
  }
};

/**
 * Sign out from Google
 */
export const signOutFromGoogle = () => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect();
  }
};

export default {
  initializeGoogleAuth,
  signInWithGooglePopup,
  signInWithGoogleOneTap,
  signOutFromGoogle
};