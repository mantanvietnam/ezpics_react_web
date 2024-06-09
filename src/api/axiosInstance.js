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
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            // if (typeof window !== 'undefined') {
            //     localStorage.removeItem('token');
            //     // Only redirect if the request is for a protected route
            //     const protectedRoutes = ['/dashboard', '/profile', '/settings']; // Define your protected routes here
            //     if (protectedRoutes.includes(Router.pathname)) {
            //         Router.push('/login');
            //     }
            // }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;