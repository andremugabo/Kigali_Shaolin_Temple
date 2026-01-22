import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005/api';
const UPLOAD_BASE_URL = 'http://localhost:3005';

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
