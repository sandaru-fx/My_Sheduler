// API service for handling backend requests
const API_URL = 'http://localhost:5000/api';

// Enable debug mode for detailed logging
const DEBUG = true;

// Helper function for logging
const logDebug = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`🔍 API DEBUG: ${message}`);
    if (data) console.log(data);
  }
};

// Helper to handle API errors
const handleApiError = (error: any, endpoint: string) => {
  console.error(`❌ API Error at ${endpoint}:`, error);
  
  // Log detailed error information
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    console.error('🔴 Network Error: Failed to fetch. Server might be down or unreachable.');
    console.error('🔍 Check if the server is running at:', API_URL);
    console.error('🔍 Check your .env file for correct MONGODB_URI and PORT settings');
    return new Error('Server connection failed. Please check if the server is running.');
  }
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('🔴 Server responded with error:', error.response.status);
    console.error('🔴 Response data:', error.response.data);
    return new Error(error.response.data.message || `Server error: ${error.response.status}`);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('🔴 No response received from server');
    return new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('🔴 Request setup error:', error.message);
    return new Error(error.message || 'An error occurred');
  }
};

// Authentication API calls
export const authApi = {
  // Sign up new user
  async signUp(name: string, email: string, password: string) {
    const endpoint = '/auth/signup';
    logDebug(`Making POST request to ${endpoint}`, { name, email });
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      logDebug(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        logDebug('Error data:', errorData);
        throw new Error(errorData.message || 'Failed to sign up');
      }
      
      const data = await response.json();
      logDebug('Signup successful:', data);
      return data;
    } catch (error) {
      throw handleApiError(error, endpoint);
    }
  },
  
  // Sign in existing user
  async signIn(email: string, password: string) {
    const endpoint = '/auth/signin';
    logDebug(`Making POST request to ${endpoint}`, { email });
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      logDebug(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        logDebug('Error data:', errorData);
        throw new Error(errorData.message || 'Invalid email or password');
      }
      
      const data = await response.json();
      logDebug('Sign-in successful:', data);
      return data;
    } catch (error) {
      throw handleApiError(error, endpoint);
    }
  },
  
  // Get user profile
  async getProfile(token: string) {
    const endpoint = '/auth/profile';
    logDebug(`Making GET request to ${endpoint}`);
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      logDebug(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        logDebug('Error data:', errorData);
        throw new Error(errorData.message || 'Failed to get profile');
      }
      
      const data = await response.json();
      logDebug('Profile data retrieved:', data);
      return data;
    } catch (error) {
      throw handleApiError(error, endpoint);
    }
  },
  
  // Update user profile
  async updateProfile(token: string, userData: { name?: string; email?: string; profilePicture?: string; role?: string; bio?: string; theme?: string }) {
    const endpoint = '/auth/profile';
    logDebug(`Making PUT request to ${endpoint}`, userData);
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      logDebug(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        logDebug('Error data:', errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      logDebug('Profile updated successfully:', data);
      return data;
    } catch (error) {
      throw handleApiError(error, endpoint);
    }
  },
  
  // Change password
  async changePassword(token: string, currentPassword: string, newPassword: string) {
    const endpoint = '/auth/change-password';
    logDebug(`Making POST request to ${endpoint}`);
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      logDebug(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        logDebug('Error data:', errorData);
        throw new Error(errorData.message || 'Failed to change password');
      }
      
      const data = await response.json();
      logDebug('Password changed successfully');
      return data;
    } catch (error) {
      throw handleApiError(error, endpoint);
    }
  }
};

// Check if server is running
export const checkServerStatus = async () => {
  logDebug('Checking server status');
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    logDebug(`Server health check status: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error('🔴 Server health check failed:', error);
    return false;
  }
};

export default {
  auth: authApi,
  checkServerStatus
};
