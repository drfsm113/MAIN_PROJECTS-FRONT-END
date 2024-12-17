// src/services/AuthService.js
import axios from 'axios';
import store from '../store/Store';
import { setTokens, logout, refreshToken as refreshTokenAction } from '../store/reducers/authSlice';

const API_URL = 'http://127.0.0.1:8000/accounts/';

class AuthService {
    constructor() {
        this.api = axios.create({
            baseURL: 'http://127.0.0.1:8000'
        });

        this.api.interceptors.request.use(
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

        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const state = store.getState();
                        const refreshTokenValue = state.auth.refreshToken;
                        const response = await axios.post(`${API_URL}api/token/refresh/`, { refresh: refreshTokenValue });
                        store.dispatch(refreshTokenAction(response.data.access));
                        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        store.dispatch(logout());
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    getApi() {
        return this.api;
    }

    async login(email, password) {
        try {
            const response = await this.api.post(`${API_URL}api/user-login/`, { email, password });
            if (response.data.success) {
                store.dispatch(setTokens({
                    accessToken: response.data.access,
                    refreshToken: response.data.refresh
                }));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const state = store.getState();
            const refreshToken = state.auth.refreshToken;
            if (refreshToken) {
                await this.api.post(`${API_URL}api/user-logout/`, { refresh_token: refreshToken });
            }
        } catch (error) {
            console.error('Error during server logout:', error);
        } finally {
            store.dispatch(logout());
        }
    }

    async refreshToken() {
        try {
            const state = store.getState();
            const refreshToken = state.auth.refreshToken;
            if (refreshToken) {
                const response = await this.api.post(`${API_URL}api/token/refresh/`, { refresh: refreshToken });
                store.dispatch(refreshTokenAction(response.data.access));
                return response.data.access;
            }
            throw new Error('No refresh token available');
        } catch (error) {
            console.error('Error refreshing token:', error);
            store.dispatch(logout());
            throw error;
        }
    }

    isAuthenticated() {
        const state = store.getState();
        return !!state.auth.accessToken;
    }
}

const authService = new AuthService();
export default authService;

// import axios from 'axios';
// import {clearUser, setUserSlug, updateUser} from "../store/actions/userActions";
// import store from "../store/Store";
//
// const API_URL = 'http://127.0.0.1:8000/accounts/';
//
// class AuthService {
//     constructor() {
//         this.init();
//     }
//
//     init() {
//         axios.interceptors.request.use(
//             (config) => {
//                 const token = this.getToken();
//                 if (token) {
//                     config.headers['Authorization'] = `Bearer ${token}`;
//                 }
//                 return config;
//             },
//             (error) => {
//                 return Promise.reject(error);
//             }
//         );
//
//         axios.interceptors.response.use(
//             (response) => response,
//             async (error) => {
//                 const originalRequest = error.config;
//                 if (error.response?.status === 401 && !originalRequest._retry) {
//                     originalRequest._retry = true;
//                     try {
//                         const refreshToken = this.getRefreshToken();
//                         const response = await this.refreshAccessToken(refreshToken);
//                         this.setToken(response.data.access);
//                         return axios(originalRequest);
//                     } catch (refreshError) {
//                         this.logout();
//                         return Promise.reject(refreshError);
//                     }
//                 }
//                 return Promise.reject(error);
//             }
//         );
//     }
//
//     async login(email, password) {
//         try {
//             const response = await axios.post(`${API_URL}api/user-login/`, { email, password });
//             if (response.data.access) {
//                 this.setToken(response.data.access);
//                 this.setRefreshToken(response.data.refresh);
//                 localStorage.setItem('user_details', JSON.stringify(response.data.user_detail));
//                 store.dispatch(updateUser({
//                     user: response.data.user_detail,
//                     userRole: response.data.role
//                 }));
//                 store.dispatch(setUserSlug(response.data.user_detail.slug));
//             }
//             return response.data;
//         } catch (error) {
//             throw error.response?.data || { message: 'An error occurred during login' };
//         }
//     }
//
//     async logout() {
//         try {
//             const refreshToken = this.getRefreshToken();
//             if (refreshToken) {
//                 await axios.post(`${API_URL}api/user-logout/`, { refresh_token: refreshToken });
//             }
//         } catch (error) {
//             console.error('Error during server logout:', error);
//         } finally {
//             // Always perform client-side logout
//             this.clearLocalStorage();
//             store.dispatch(clearUser());
//         }
//     }
//
//     clearLocalStorage() {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('user_details');
//         localStorage.removeItem('user_slug');
//     }
//
//     async refreshAccessToken(refreshToken) {
//         return axios.post(`${API_URL}api/token/refresh/`, { refresh: refreshToken });
//     }
//
//     getToken() {
//         return localStorage.getItem('access_token');
//     }
//
//     setToken(token) {
//         localStorage.setItem('access_token', token);
//     }
//
//     getRefreshToken() {
//         return localStorage.getItem('refresh_token');
//     }
//
//     setRefreshToken(token) {
//         localStorage.setItem('refresh_token', token);
//     }
//
//     isLoggedIn() {
//         const token = this.getToken();
//         return !!token;
//     }
//
//     getCurrentUser() {
//         return JSON.parse(localStorage.getItem('user_details'));
//     }
// }
//
// const authService = new AuthService();
// export default authService;