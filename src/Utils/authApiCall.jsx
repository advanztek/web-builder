import { BASE_SERVER_URL } from '../Config/url';

export const authApiCall = async (endpoint, data, method = 'POST', contentType = 'application/json') => {
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
