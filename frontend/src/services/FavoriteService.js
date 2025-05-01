import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/favorites';

class FavoriteService {
    // Get all favorites
    static async getAllFavorites() {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    }

    // Get favorite by ID
    static async getFavoriteById(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching favorite:', error);
            throw error;
        }
    }

    // Add new favorite with optional reminder
    static async addFavorite(recipeName, reminderDateTime = null) {
        try {
            const response = await axios.post(API_BASE_URL, {
                recipeName,
                reminderDateTime
            });
            return response.data;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    }

    // Update favorite reminder
    static async updateFavoriteReminder(id, reminderDateTime) {
        try {
            const favorite = await this.getFavoriteById(id);
            const response = await axios.put(`${API_BASE_URL}/${id}`, {
                ...favorite,
                reminderDateTime
            });
            return response.data;
        } catch (error) {
            console.error('Error updating favorite reminder:', error);
            throw error;
        }
    }

    // Remove reminder from favorite
    static async removeReminder(id) {
        try {
            const favorite = await this.getFavoriteById(id);
            const response = await axios.put(`${API_BASE_URL}/${id}`, {
                ...favorite,
                reminderDateTime: null
            });
            return response.data;
        } catch (error) {
            console.error('Error removing reminder:', error);
            throw error;
        }
    }

    // Delete favorite
    static async deleteFavorite(id) {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting favorite:', error);
            throw error;
        }
    }
}

export default FavoriteService; 