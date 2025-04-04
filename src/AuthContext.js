import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        const userData = JSON.parse(localStorage.getItem("userData"));

        if (token && userData) {
          // Verify token is still valid
          setUser({
            token,
            refreshToken,
            ...userData,
          });
        } else if (refreshToken) {
          // Try to refresh token if access token is missing but refresh token exists
          await refreshAuth();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        logout();
      } finally {
        setIsAuthenticating(false);
      }
    };
    checkAuth();
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");
  
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`,
        { refreshToken }
      );
  
      const { token, refreshToken: newRefreshToken, user: userData } = response.data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("userData", JSON.stringify(userData));
  
      setUser({
        token,
        refreshToken: newRefreshToken,
        ...userData,
      });
  
      return { success: true };
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return { success: false, error: error.message };
    }
  }, []);

  const login = async (email) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        { email }
      );

      const { token, refreshToken, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userData", JSON.stringify(userData));

      setUser({
        token,
        refreshToken,
        ...userData,
      });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const signup = async (email) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        { email }
      );

      const { token, refreshToken, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userData", JSON.stringify(userData));

      setUser({
        token,
        refreshToken,
        ...userData,
      });

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Signup failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/delete-account`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      logout();
      return { success: true };
    } catch (error) {
      console.error("Delete account error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to delete account" 
      };
    }
  };

  const updateRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticating,
    login,
    signup,
    logout,
    deleteAccount,
    updateRole,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};