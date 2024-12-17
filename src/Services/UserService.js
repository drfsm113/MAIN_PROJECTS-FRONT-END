// src/services/UserService.js
import authService from './AuthService';

const API_URL = 'http://127.0.0.1:8000/accounts/api/v1/client/';
const MainAPI_URL = 'http://127.0.0.1:8000/accounts/api/';

class UserService {
    async register(userData) {
        try {
            console.debug('Attempting user registration...');
            const response = await authService.getApi().post(`${MainAPI_URL}register/`, userData);
            console.debug('User registration successful');
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error.response?.data || error;
        }
    }

    async getUserDetails() {
        try {
            console.debug('Fetching user details...');
            const response = await authService.getApi().get(`${API_URL}current_user_details/`);
            console.debug('User details fetched successfully');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error.response?.data || error;
        }
    }

    async updateProfile(slug, userData) {
        try {
            console.debug('Updating user profile...');
            const response = await authService.getApi().put(`${API_URL}user/${slug}/update/`, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.debug('Profile updated successfully');
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error.response?.data || error;
        }
    }

    async deactivateAccount(slug) {
        try {
            console.debug('Deactivating account...');
            const response = await authService.getApi().put(`${API_URL}user/${slug}/update/`, { is_active: false });
            console.debug('Account deactivated successfully');
            return response.data;
        } catch (error) {
            console.error('Error deactivating account:', error);
            throw error.response?.data || error;
        }
    }

    async deleteAccount(slug) {
        try {
            console.debug('Deleting account...');
            const response = await authService.getApi().delete(`${API_URL}user/${slug}/delete/`);
            console.debug('Account deleted successfully');
            return response.data;
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error.response?.data || error;
        }
    }
}

const userService = new UserService();
export default userService;