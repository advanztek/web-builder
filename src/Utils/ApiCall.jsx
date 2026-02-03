import { BASE_SERVER_URL } from '../Config/url';

const getAuthToken = () => {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken')
  );
};

export const apiCall = async (
  endpoint,
  data = null,
  method = 'POST',
  contentType = 'application/json'
) => {
  const token = getAuthToken();
  const fullUrl = `${BASE_SERVER_URL}${endpoint}`;

  
  if (typeof method !== 'string') {
    console.error('❌ apiCall called with invalid method:', method);
    throw new Error('apiCall: HTTP method must be a string (e.g. "POST")');
  }

  const options = {
    method: method.toUpperCase(),
    headers: {},
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = data instanceof FormData;
  const isUrlEncoded = contentType === 'application/x-www-form-urlencoded';

  // === CRITICAL FIX: BODY HANDLING ===
  if (isFormData) {
    // ⚠️ DO NOT SET Content-Type for FormData!
    // The browser automatically sets it with the correct boundary
    options.body = data;
    
    console.log('📦 Sending FormData:');
    for (let pair of data.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }
  } else if (data && options.method !== 'GET') {
    if (isUrlEncoded) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.body = new URLSearchParams(data).toString();
    } else {
      // Default JSON
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
  }

  try {
    console.log(`🌐 API Call: ${options.method} ${endpoint}`);
    
    const response = await fetch(fullUrl, options);

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (response.status === 401) {
      localStorage.clear();
      throw new Error('Unauthorized! Please log in again.');
    }

    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    const responseContentType = response.headers.get('content-type') || '';

    if (!responseContentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.slice(0, 300));
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    console.log('📥 API Response:', result);

    if (result?.success === false) {
      throw new Error(result.message || 'Request failed');
    }

    return result;
  } catch (err) {
    console.error(`❌ API Error [${options.method} ${endpoint}]:`, err);
    throw err;
  }
};