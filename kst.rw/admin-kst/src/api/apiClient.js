import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'https://kst-backend.onrender.com';

console.log('📡 [API]: Base API URL:', API_URL);
console.log('📡 [API]: Upload Base URL:', UPLOAD_URL);

const UPLOAD_BASE_URL = UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Resolves local upload paths to absolute URLs.
 * @param {string} path - The relative path from the backend (e.g., 'uploads/image.jpg').
 * @returns {string} - The absolute URL.
 */
export const getMediaPath = (path) => {
    if (!path) return null;
    if (typeof path !== 'string') return null;
    if (path.startsWith('http')) return path;

    // Ensure path doesn't start with leading slash for consistent joining
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    const finalUrl = `${UPLOAD_BASE_URL}/${cleanPath}`;
    // console.log(`🔗 [Media Resolved]: ${path} -> ${finalUrl}`);
    return finalUrl;
};

// Add a request interceptor to attach the JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (e.g., redirect to login or clear token)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
