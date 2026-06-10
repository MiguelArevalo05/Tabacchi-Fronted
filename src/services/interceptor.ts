import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: process.env.NEXT_PUBLIC_TIMEOUT ? parseInt(process.env.NEXT_PUBLIC_TIMEOUT) : 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

export default api;