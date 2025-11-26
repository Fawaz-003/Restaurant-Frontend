import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// localStorage keys
const TOKEN_KEY = "user_token";
const USER_DATA_KEY = "user_data";

export const AppProvider = ({ children }) => {
  // Get baseURL from environment variable
  const baseURL = import.meta.env.VITE_BACKEND_URL || "";

  // State for token and user data
  const [token, setTokenState] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [userData, setUserDataState] = useState(() => {
    // Initialize from localStorage
    const storedUserData = localStorage.getItem(USER_DATA_KEY);
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  // Update localStorage when userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
  }, [userData]);

  // Function to set token
  const setToken = (newToken) => {
    setTokenState(newToken);
  };

  // Function to set user data
  const setUserData = (data) => {
    setUserDataState(data);
  };

  // Function to clear token and user data (logout)
  const logout = () => {
    setTokenState(null);
    setUserDataState(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    baseURL,
    token,
    userData,
    setToken,
    setUserData,
    logout,
    isAuthenticated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

