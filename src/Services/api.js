// src/services/api.js
import axios from 'axios';
import store from "../store/Store";
import { logout, refreshToken } from "../store/reducers/authSlice";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const state = store.getState();
                const refreshTokenValue = state.auth.refreshToken;
                const response = await axios.post('/accounts/api/token/refresh/', { refresh: refreshTokenValue });
                store.dispatch(refreshToken(response.data.access));
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;