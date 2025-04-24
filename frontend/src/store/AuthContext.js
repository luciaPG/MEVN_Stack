import { reactive, provide, inject } from 'vue';
import axios from 'axios';

// Create a symbol for the authentication context
const AuthSymbol = Symbol();

// Simple error message translations
const errorMessages = {
  'Correo o contraseña incorrectos': 'Incorrect email or password',
  'No se recibió respuesta del servidor. Verifique su conexión a internet.': 'No response received from server. Please check your internet connection.',
  'No se puede conectar al servidor. Por favor, verifica que el servidor esté en funcionamiento.': 'Cannot connect to the server. Please verify that the server is running.',
  'Formato de respuesta inválido del servidor': 'Invalid response format from server'
};

// Create the reactive auth state
export const globalAuth = reactive({
  _isAuthenticated: false,  // Internal property
  user: null,
  token: null,
  lastError: null,
  

  
  // This allows calling it as a function too
  isAuthenticated() {
    return this._isAuthenticated;
  },
  
  // Keep original method for backward compatibility
  getIsAuthenticated() {
    return this._isAuthenticated;
  },
  
  getUserId() {
    return this.user ? this.user._id || this.user.id : null;
  },
  
  isAdmin() {
    return this.user?.role === 'admin';
  },
  
  // Improved getAuthHeaders method for API requests
  getAuthHeaders() {
    const token = this.token || localStorage.getItem('jwt');
    if (!token) {
      console.warn('No authentication token available');
      return {};
    }
    console.log('Using token for authentication:', token.substring(0, 10) + '...');
    return {
      Authorization: `Bearer ${token}`
    };
  },
  
  async login({ email, password }) {
    try {
      this.lastError = null;
      console.log("Attempting login with:", email);
      
      // Send password as plaintext - no encryption at client side
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      console.log("Login response:", response.data);

      const { token, data } = response.data;
      const user = data?.user;

      if (!token || !user) {
        console.error("Invalid response format:", response.data);
        throw new Error("Formato de respuesta inválido del servidor");
      }

      this.setUser(user);
      this.setToken(token);
      this._isAuthenticated = true;

      return user;
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "An unknown error occurred";
      
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage = "No se recibió respuesta del servidor. Verifique su conexión a internet.";
      }
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = "No se puede conectar al servidor. Por favor, verifica que el servidor esté en funcionamiento.";
      }
      
      const translatedMessage = errorMessages[errorMessage] || errorMessage;
      
      this.lastError = translatedMessage;
      
      throw new Error(translatedMessage);
    }
  },
  
  async loadUserData() {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.token = token;
  
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
          this._isAuthenticated = true;
        } catch (e) {
          console.error('Failed to parse user data', e);
          this.logout();
        }
      }
  
      return true;
    }
    return false;
  },

  setUser(user) {
    this.user = user;
    this._isAuthenticated = !!user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },
  
  setToken(token) {
    this.token = token;
    localStorage.setItem('jwt', token);
  },
  
  logout() {
    this.user = null;
    this.token = null;
    this._isAuthenticated = false;
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  },

  getLastError() {
    return this.lastError;
  },
  
  clearError() {
    this.lastError = null;
  }
});

// Provider and injector functions
export function provideAuth() {
  provide(AuthSymbol, globalAuth);
}

export function useAuth() {
  const auth = inject(AuthSymbol);
  if (!auth) {
    throw new Error('No auth context provided');
  }
  return auth;
}