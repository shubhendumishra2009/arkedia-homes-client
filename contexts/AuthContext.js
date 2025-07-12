import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create the context with default values to prevent undefined errors
const AuthContext = createContext({
  user: null,
  loading: true,
  register: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => {},
  isAuthenticated: () => false,
  hasRole: () => false,
  updateProfile: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  resetPassword: () => Promise.resolve()
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // API base URL
  console.log('All environment variables:', process.env);
  console.log('Build time environment:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV
  });
  console.log('Environment variables:', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  console.error('NEXT_PUBLIC_API_URL is not defined!');
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}
  //const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  
  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      toast.success('Registration successful! Please sign in.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log('Attempting login with credentials:', credentials);
      const loginUrl = `${API_URL}/auth/login`;
      console.log('Calling login API at:', loginUrl);
      const response = await axios.post(loginUrl, credentials);
      console.log('Login API response:', {
        url: loginUrl,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      if (!response.data) {
        console.error('Invalid API response: Missing data field');
        throw new Error('Invalid API response: Missing data field');
      }
      
      // Handle both response formats - with data.user and direct user object
      // The server returns data in format: { success, message, data: { user, token } }
      const user = response.data.data?.user || response.data.user || response.data;
      
      if (!user) {
        console.error('Invalid API response: Missing user field', response.data);
        throw new Error('Invalid API response: Missing user field');
      }
      
      // Fetch user details including role from database if not provided in initial response
      if (!user.role) {
        const userDetails = await axios.get(`${API_URL}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${response.data.token || response.data?.data?.token}`
          }
        });
        user.role = userDetails.data.role;
      }
      
      // Handle different token locations in response
      const token = response.data.data?.token || response.data.token;
      
      if (!token) {
        console.error('Invalid API response: Missing token field', response.data);
        throw new Error('Invalid API response: Missing token field');
      }
      
      // Validate user object
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user data received from API');
      }
      
      // Validate token
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token received from API');
      }
      
      // Log token details for debugging
      console.log('Token details:', {
        tokenExists: !!token,
        tokenLength: token?.length,
        tokenType: typeof token,
        first10Chars: token?.substring(0, 10),
        last10Chars: token?.substring(token?.length - 10)
      });
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state and wait for it to complete
      await new Promise(resolve => {
        setUser(user);
        setTimeout(resolve, 0);
      });
      
      console.log('User state updated:', {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        fullData: user
      });
      toast.success('Login successful!');
      
      // Redirect based on user role after state updates
      console.log('Attempting redirect for role:', user?.role);
      
      // Default redirect if role is not specified
      if (!user?.role) {
        await router.push('/');
      } else if (user.role === 'admin') {
        await router.push('/admin/dashboard');
      } else {
        await router.push('/tenant/dashboard');
      }
      console.log('Redirect completed');
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('You have been logged out');
    router.push('/');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/auth/profile`, userData);
      const updatedUser = response.data.user;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      
      // Validate password data
      if (!passwordData.currentPassword) {
        throw new Error('Current password is required');
      }
      
      if (!passwordData.newPassword) {
        throw new Error('New password is required');
      }
      
      if (passwordData.newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }
      
      // Make API call to change password
      const response = await axios.post(`${API_URL}/auth/change-password`, passwordData);
      
      // Log success for debugging
      console.log('Password change successful:', response.data);
      
      // Show success message
      toast.success('Password changed successfully!');
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      
      // Handle different types of errors
      let message;
      
      if (error.message) {
        // Client-side validation errors
        message = error.message;
      } else if (error.response?.data?.message) {
        // Server-side errors with message
        message = error.response.data.message;
      } else if (error.response?.status === 401) {
        message = 'Current password is incorrect';
      } else if (error.response?.status === 403) {
        message = 'You are not authorized to change this password';
      } else {
        message = 'Failed to change password';
      }
      
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      toast.success('Password reset instructions sent to your email!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to process request';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/reset-password`, resetData);
      toast.success('Password reset successful! Please sign in with your new password.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Set up axios interceptor for token handling
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add a response interceptor for handling token expiration
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
          toast.error('Your session has expired. Please sign in again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Remove the interceptor when the component unmounts
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated,
    hasRole,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};