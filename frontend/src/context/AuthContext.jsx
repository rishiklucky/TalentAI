import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const fetchUser = async () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const parsed = JSON.parse(storedUserInfo);
          // Fetch full fresh profile from backend
          const res = await authAPI.getProfile();
          setUser(res.data);
        } catch (error) {
          console.error('Failed to load user profile on startup', error);
          // Token expired or invalid
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      // Fetch full profile details
      const profileRes = await authAPI.getProfile();
      setUser(profileRes.data);
      setLoading(false);
      return profileRes.data;
    } catch (error) {
      setLoading(false);
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      localStorage.setItem('userInfo', JSON.stringify(res.data));

      // Fetch full profile details
      const profileRes = await authAPI.getProfile();
      setUser(profileRes.data);
      setLoading(false);
      return profileRes.data;
    } catch (error) {
      setLoading(false);
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(profileData);
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      throw error.response?.data?.message || 'Failed to update profile';
    }
  };

  const upgradeToPremium = async (couponCode) => {
    setLoading(true);
    try {
      const res = await authAPI.upgrade({ couponCode });
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.subscription = res.data.subscription;
        localStorage.setItem('userInfo', JSON.stringify(parsed));
      }
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      throw error.response?.data?.message || 'Failed to upgrade subscription';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        upgradeToPremium,
        isAuthenticated: !!user,
        isPremium: user?.subscription === 'PREMIUM',
        isRecruiter: user?.role === 'recruiter',
        isStudent: user?.role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
