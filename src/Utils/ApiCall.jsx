
import { BASE_SERVER_URL } from '../Config/url';

const getAuthToken = () => {
    return localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken');
};

export const apiCall = async (endpoint, data, method = 'POST', contentType = 'application/json') => {
    const token = getAuthToken();
    const fullUrl = `${BASE_SERVER_URL}${endpoint}`;

    console.log('API CALL:', method, fullUrl);

    const options = {
        method,
        headers: {
            'Content-Type': contentType,
        },
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (method !== 'GET' && method !== 'DELETE') {
        if (contentType === 'application/json') {
            options.body = JSON.stringify(data);
        } else if (contentType === 'application/x-www-form-urlencoded') {
            options.body = new URLSearchParams(data);
        }
    }

    try {
        const response = await fetch(fullUrl, options);

        if (response.status === 401) {
            localStorage.clear();
            throw new Error('Unauthorized! Please log in again.');
        }

        if (response.status === 404) {
            throw new Error('Resource not found');
        }

        const responseContentType = response.headers.get('content-type');

        if (!responseContentType || !responseContentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text.substring(0, 500));
            throw new Error(`Server error: Expected JSON but got ${response.status}`);
        }

        const result = await response.json();
        console.log('Response:', result);

        return result;

    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);

        if (error.message === 'Failed to fetch') {
            throw new Error(`Cannot connect to server at ${BASE_SERVER_URL}. Please check your connection.`);
        }

        throw error;
    }
};