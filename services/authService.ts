import { API_BASE_URL } from './db';

// Types
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface SignInResponse {
  user: AuthUser;
  token: string;
}

export interface SignUpResponse {
  user: AuthUser;
  token: string;
}

// Local storage keys
const TOKEN_KEY = 'timeflow_auth_token';
const USER_KEY = 'timeflow_auth_user';

// Authentication service
export const authService = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<SignInResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign in');
      }

      const data = await response.json();
      
      // Save auth data to local storage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign up with name, email, and password
  signUp: async (name: string, email: string, password: string): Promise<SignUpResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account');
      }

      const data = await response.json();
      
      // Save auth data to local storage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get current user from local storage
  getCurrentUser: (): AuthUser | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get auth token from local storage
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Update user profile
  updateProfile: async (userData: Partial<AuthUser>): Promise<AuthUser> => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update user in local storage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data.user };
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
      
      return data.user;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

// Helper function to add auth token to API requests
export const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export default authService;
