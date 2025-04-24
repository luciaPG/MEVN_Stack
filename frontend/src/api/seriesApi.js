import axios from 'axios';
import { globalAuth } from '../store/AuthContext';

/**
 * Series API - A simple API module that can be used anywhere without Vue components
 */

const API_URL = 'http://localhost:5000/api';

export default {
  /**
   * Get all series
   */
  getAllSeries: async () => {
    try {
      const response = await axios.get(`${API_URL}/series`);
      return response.data;
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  },

  /**
   * Get a series by ID
   */
  getSeriesById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/series/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching series details:', error);
      throw error;
    }
  },

  /**
   * Get all series registered by the current user
   */
  getUserSeries: async () => {
    try {
      // First ensure user is authenticated
      if (!globalAuth.isAuthenticated()) {
        throw new Error('User not authenticated');
      }
      
      // Get the current user from global auth
      const currentUser = globalAuth.getCurrentUser();
      if (!currentUser || !currentUser._id) {
        throw new Error('User ID not available');
      }
      
      // Make authenticated request with proper headers
      const headers = globalAuth.getAuthHeaders();
      const userId = currentUser._id;
      
      const response = await axios.get(
        `${API_URL}/series/user/${userId}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user series:', error);
      
      // Try alternative endpoint if first one fails
      if (globalAuth.isAuthenticated() && globalAuth.getCurrentUser()) {
        try {
          const headers = globalAuth.getAuthHeaders();
          const userId = globalAuth.getCurrentUser()._id;
          
          const altResponse = await axios.get(
            `${API_URL}/series/registered/${userId}`,
            { headers }
          );
          
          return altResponse.data;
        } catch (altError) {
          console.error('Alternative endpoint also failed:', altError);
        }
      }
      
      throw error;
    }
  },
  
  /**
   * Register a series for the current user
   */
  registerSeries: async (seriesId) => {
    // First ensure user is authenticated
    if (!globalAuth.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    
    // Get the current user from global auth
    const currentUser = globalAuth.getCurrentUser();
    if (!currentUser || !currentUser._id) {
      throw new Error('User ID not available');
    }
    
    // Make authenticated request with proper headers
    const headers = globalAuth.getAuthHeaders();
    const userId = currentUser._id;
    
    try {
      const response = await axios.post(
        `${API_URL}/series/register/${userId}/${seriesId}`,
        {},
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error registering series:', error);
      throw error;
    }
  },
  
  /**
   * Unregister a series for the current user
   */
  unregisterSeries: async (seriesId) => {
    // First ensure user is authenticated
    if (!globalAuth.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    
    // Get the current user from global auth
    const currentUser = globalAuth.getCurrentUser();
    if (!currentUser || !currentUser._id) {
      throw new Error('User ID not available');
    }
    
    // Make authenticated request with proper headers
    const headers = globalAuth.getAuthHeaders();
    const userId = currentUser._id;
    
    try {
      const response = await axios.delete(
        `${API_URL}/series/unregister/${userId}/${seriesId}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error unregistering series:', error);
      throw error;
    }
  }
}; 