import axios from 'axios';

console.log('📡 [Frontend API]: Base URL is:', import.meta.env.VITE_API_URL);

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_URL || 'https://kst-backend.onrender.com';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
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
    if (path.startsWith('http')) return path;
    // Ensure path doesn't start with leading slash if UPLOAD_BASE_URL doesn't end with one
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${UPLOAD_BASE_URL}${normalizedPath}`;
};

export default apiClient;
