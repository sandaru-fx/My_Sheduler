import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi, checkServerStatus } from '../services/api';

// AuthUser type matching MongoDB User model
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role?: string;
  bio?: string;
  theme?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  serverConnected: boolean;
  connectionError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (userData: { name?: string; email?: string; profilePicture?: string; role?: string; bio?: string; theme?: string }) => Promise<void>;
  checkConnection: () => Promise<boolean>;
}

// Local storage keys
const USER_KEY = 'timeflow_auth_user';
const TOKEN_KEY = 'timeflow_auth_token';

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  serverConnected: false,
  connectionError: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  updateProfile: async () => {},
  checkConnection: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved auth data from localStorage
  const getSavedUser = (): AuthUser | null => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        return null;
      }
    }
    return null;
  };
  
  const getSavedToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const [user, setUser] = useState<AuthUser | null>(getSavedUser());
  const [token, setToken] = useState<string | null>(getSavedToken());
  const [isLoading, setIsLoading] = useState(false);
  const [serverConnected, setServerConnected] = useState<boolean>(true); // Optimistic initial state
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Check server connection and validate token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // First check if server is running
      const isServerConnected = await checkConnection();
      
      if (isServerConnected) {
        // If server is connected, validate token
        const savedToken = getSavedToken();
        if (savedToken) {
          try {
            // Verify token by fetching user profile
            const response = await authApi.getProfile(savedToken);
            setUser(response.user);
            setToken(savedToken);
          } catch (error) {
            console.error('Invalid token:', error);
            // Token is invalid, clear auth data
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
            setToken(null);
          }
        }
      } else {
        // If server is not connected, use local fallback if available
        console.log('Using local auth fallback due to server connection issue');
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
    
    // Set up periodic connection check
    const connectionCheckInterval = setInterval(() => {
      checkConnection().then(connected => {
        if (connected && !serverConnected) {
          // If connection was restored, clear error
          setConnectionError(null);
        }
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(connectionCheckInterval);
  }, []);
  
  // Check server connection
  const checkConnection = async (): Promise<boolean> => {
    try {
      const isConnected = await checkServerStatus();
      setServerConnected(isConnected);
      
      if (!isConnected) {
        setConnectionError('Cannot connect to server. Using offline mode.');
      } else {
        setConnectionError(null);
      }
      
      return isConnected;
    } catch (error) {
      console.error('Connection check error:', error);
      setServerConnected(false);
      setConnectionError('Server connection error. Using offline mode.');
      return false;
    }
  };

  // Authentication with MongoDB backend and fallback
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // First check if server is connected
      const isConnected = await checkConnection();
      
      if (isConnected) {
        // Online mode - use MongoDB
        const response = await authApi.signIn(email, password);
        
        // Save auth data to localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        localStorage.setItem(TOKEN_KEY, response.token);
        
        setUser(response.user);
        setToken(response.token);
      } else {
        // Offline mode - fallback to demo account
        if (email === 'demo@example.com' && password === 'password') {
          // Demo user for offline mode
          const demoUser: AuthUser = {
            _id: 'offline-demo-user',
            name: 'Demo User (Offline)',
            email: 'demo@example.com',
            profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
            createdAt: new Date().toISOString()
          };
          
          localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
          setUser(demoUser);
          setToken('offline-demo-token'); // Dummy token for offline mode
          
          console.log('Using offline demo account');
        } else {
          throw new Error('Server is currently unavailable. Please try again later or use the demo account (demo@example.com / password).');
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.signUp(name, email, password);
      
      // Save auth data to localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      localStorage.setItem(TOKEN_KEY, response.token);
      
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };
  
  // Update user profile
  const updateProfile = async (userData: { name?: string; email?: string; profilePicture?: string; role?: string; bio?: string; theme?: string }) => {
    if (!token) throw new Error('Authentication required');
    
    setIsLoading(true);
    try {
      const response = await authApi.updateProfile(token, userData);
      
      // Update local user data
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      setUser(response.user);
      
      return response.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    serverConnected,
    connectionError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    checkConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
