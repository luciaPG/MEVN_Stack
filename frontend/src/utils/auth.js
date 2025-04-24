// Import the global auth methods from AuthContext
import { globalAuth } from "../store/AuthContext";

/**
 * Example utility functions that can be used from anywhere in the application
 * without needing to use Vue's composition API or inject/provide system
 */

// Check if user is authenticated
export const isUserLoggedIn = () => {
  return globalAuth.isAuthenticated();
};

// Get current user data
export const getCurrentUser = () => {
  return globalAuth.getCurrentUser();
};

// Get user ID
export const getUserId = () => {
  const user = globalAuth.getCurrentUser();
  return user ? user._id || user.id : null;
};

// Get authentication headers for API requests
export const getAuthHeaders = () => {
  return globalAuth.getAuthHeaders();
};

// Force refresh user data from server
export const refreshUserData = async () => {
  return await globalAuth.loadUserData();
};

// Example of using auth in API requests
export const makeAuthenticatedRequest = async (
  url,
  method = "GET",
  data = null
) => {
  try {
    const headers = getAuthHeaders();

    // This is just an example - in a real app you would use axios directly
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(data && { body: JSON.stringify(data) }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error making authenticated request:", error);
    throw error;
  }
};
