import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_ROOT,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to save user data to external API:', response.status, response.statusText);
            throw new Error(`Failed with status: ${response.status}`);
        }
    },
    error => {
        if (error.response) {
            console.error('Response error:', error.response.status, error.response.data);
            throw new Error(`Failed with status: ${error.response.status}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received from the server');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error(`Error setting up request: ${error.message}`);
        }
    }
);

export default axiosInstance;