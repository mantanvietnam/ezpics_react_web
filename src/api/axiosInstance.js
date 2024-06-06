import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_ROOT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add any custom headers or modify the request config here
        // Example: config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle response errors here
        const errorMessage =
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;

        // You can handle different error cases based on the status code or other properties
        switch (error.response && error.response.status) {
            case 400:
                // Bad Request
                console.error('Bad Request:', errorMessage);
                break;
            case 401:
                // Unauthorized
                console.error('Unauthorized:', errorMessage);
                break;
            case 403:
                // Forbidden
                console.error('Forbidden:', errorMessage);
                break;
            case 404:
                // Not Found
                console.error('Not Found:', errorMessage);
                break;
            case 500:
                // Internal Server Error
                console.error('Internal Server Error:', errorMessage);
                break;
            default:
                console.error('API call error:', errorMessage);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;