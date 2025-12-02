import { useMemo } from "react";
import { useAppContext } from "../Context/AppContext";

// Helper function to make API calls
const apiCall = async (baseURL, token, endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add token to headers if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Helper function for FormData requests (file uploads)
const apiCallFormData = async (baseURL, token, endpoint, formData, method = "POST") => {
  const url = `${baseURL}${endpoint}`;
  const headers = {};

  // Add token to headers if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Helper function to create API functions with context
export const createApiFunctions = (baseURL, token) => {

  // ==================== USER API ENDPOINTS ====================
  
  // Register a new user
  const registerUser = async (userData) => {
    return apiCall(baseURL, null, "/api/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  };

  // Login user
  const loginUser = async (credentials) => {
    return apiCall(baseURL, null, "/api/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  };

  // Admin login
  const adminLogin = async (credentials) => {
    return apiCall(baseURL, null, "/api/users/admin", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  };

  // Get current user profile
  const getMe = async () => {
    return apiCall(baseURL, token, "/api/users/me", {
      method: "GET",
    });
  };

  // Google OAuth - redirect to Google
  const googleAuth = () => {
    window.location.href = `${baseURL}/api/users/google`;
  };

  // Admin create user
  const adminCreateUser = async (userData) => {
    return apiCall(baseURL, token, "/api/users/create", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  };

  // Get all users (Admin only)
  const getAllUsers = async () => {
    return apiCall(baseURL, token, "/api/users/all", {
      method: "GET",
    });
  };

  // Update user (Admin only)
  const updateUser = async (id, userData) => {
    return apiCall(baseURL, token, `/api/users/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  };

  // ==================== SHOP API ENDPOINTS ====================
  
  // Get all shops
  const getAllShops = async () => {
    return apiCall(baseURL, null, "/api/shops", {
      method: "GET",
    });
  };

  // Get shops for the logged-in seller
  const getMyShops = async () => {
    return apiCall(baseURL, token, "/api/shops/my-shops", {
      method: "GET",
    });
  };

  // Get shop by ID
  const getShopById = async (id) => {
    return apiCall(baseURL, null, `/api/shops/view/${id}`, {
      method: "GET",
    });
  };

  // Add a new shop (Admin only)
  const addShop = async (shopData, imageFile) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    Object.keys(shopData).forEach((key) => {
      if (typeof shopData[key] === 'object' && shopData[key] !== null) {
        Object.keys(shopData[key]).forEach(subKey => {
          formData.append(`${key}[${subKey}]`, shopData[key][subKey]);
        });
      } else {
        formData.append(key, shopData[key]);
      }
    });
    return apiCallFormData(baseURL, token, "/api/shops/add", formData, "POST");
  };

  // Update shop (Admin only)
  const updateShop = async (id, shopData, imageFile = null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    Object.keys(shopData).forEach((key) => {
      if (typeof shopData[key] === 'object' && shopData[key] !== null) {
        formData.append(key, JSON.stringify(shopData[key]));
      } else {
        formData.append(key, shopData[key]);
      }
    });
    return apiCallFormData(baseURL, token, `/api/shops/update/${id}`, formData, "PUT");
  };

  // Delete shop (Admin only)
  const deleteShop = async (id) => {
    return apiCall(baseURL, token, `/api/shops/remove/${id}`, {
      method: "DELETE",
    });
  };

  // ==================== MENU API ENDPOINTS ====================
  
  // Get menu for a shop
  const getMenu = async (shopId) => {
    return apiCall(baseURL, null, `/api/menu/view/${shopId}`, {
      method: "GET",
    });
  };

  // Add menu item (Admin only)
  const addMenuItem = async (shopId, menuItemData, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    Object.keys(menuItemData).forEach((key) => {
      formData.append(key, menuItemData[key]);
    });
    return apiCallFormData(baseURL, token, `/api/menu/add/${shopId}`, formData, "POST");
  };

  // Update menu item (Admin only)
  const updateMenuItem = async (shopId, itemId, menuItemData, imageFile = null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    Object.keys(menuItemData).forEach((key) => {
      formData.append(key, menuItemData[key]);
    });
    return apiCallFormData(baseURL, token, `/api/menu/update/${shopId}/${itemId}`, formData, "PUT");
  };

  // Delete menu item (Admin only)
  const deleteMenuItem = async (shopId, itemId) => {    
    return apiCall(baseURL, token, `/api/menu/remove/${shopId}/${itemId}`, {
      method: "DELETE",
    });
  };

  // ==================== CATEGORY API ENDPOINTS ====================
  
  // Get all categories
  const listCategory = async () => {
    return apiCall(baseURL, null, "/api/category/list", {
      method: "GET",
    });
  };

  // Get single category by ID
  const singleCategory = async (id) => {
    return apiCall(baseURL, null, `/api/category/single/${id}`, {
      method: "GET",
    });
  };

  // Add category (Admin only)
  const addCategory = async (categoryData) => {
    return apiCall(baseURL, token, "/api/category/add", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  };

  // Edit category (Admin only)
  const editCategory = async (id, categoryData) => {
    return apiCall(baseURL, token, `/api/category/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  };

  // Delete category (Admin only)
  const deleteCategory = async (id) => {
    return apiCall(baseURL, token, `/api/category/delete/${id}`, {
      method: "DELETE",
    });
  };

  // ==================== ORDER API ENDPOINTS ====================

  // Get orders for the logged-in seller's shop
  const getShopOrders = async () => {
    return apiCall(baseURL, token, "/api/orders/my-shop", {
      method: "GET",
    });
  };

  return {
    // User APIs
    registerUser,
    loginUser,
    adminLogin,
    getMe,
    googleAuth,
    adminCreateUser,
    getAllUsers,
    updateUser,
    
    // Shop APIs
    getAllShops,
    listShops: getAllShops, // Alias getAllShops to listShops
    getMyShops,
    getShopById,
    addShop,
    updateShop,
    deleteShop,
    
    // Menu APIs
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    
    // Category APIs
    listCategory,
    singleCategory,
    addCategory,
    editCategory,
    deleteCategory,

    // Order APIs
    getShopOrders,
  };
};

// Hook to use API functions with context
export const useApi = () => {
  const { baseURL, token } = useAppContext();
  return useMemo(() => createApiFunctions(baseURL, token), [baseURL, token]);
};

// Export API functions as variables (can be used with baseURL and token)
export const api = {
  // User APIs
  registerUser: (baseURL, userData) => 
    apiCall(baseURL, null, "/api/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  
  loginUser: (baseURL, credentials) => 
    apiCall(baseURL, null, "/api/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  
  adminLogin: (baseURL, credentials) => 
    apiCall(baseURL, null, "/api/users/admin", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  
  getMe: (baseURL, token) => 
    apiCall(baseURL, token, "/api/users/me", {
      method: "GET",
    }),
  
  googleAuth: (baseURL) => {
    window.location.href = `${baseURL}/api/users/google`;
  },
  
  adminCreateUser: (baseURL, token, userData) => 
    apiCall(baseURL, token, "/api/users/create", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  
  getAllUsers: (baseURL, token) =>
    apiCall(baseURL, token, "/api/users/all", {
      method: "GET",
    }),

  updateUser: (baseURL, token, id, userData) =>
    apiCall(baseURL, token, `/api/users/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),


  // Shop APIs
  getAllShops: (baseURL) => 
    apiCall(baseURL, null, "/api/shops", {
      method: "GET",
    }),
  
  getMyShops: (baseURL, token) => 
    apiCall(baseURL, token, "/api/shops/my-shops", {
      method: "GET",
    }),

  getShopById: (baseURL, id) => 
    apiCall(baseURL, null, `/api/shops/view/${id}`, {
      method: "GET",
    }),
  
  addShop: (baseURL, token, shopData, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    Object.keys(shopData).forEach((key) => {
      formData.append(key, shopData[key]);
    });
    return apiCallFormData(baseURL, token, "/api/shops/add", formData, "POST");
  },
  
  updateShop: (baseURL, token, id, shopData, imageFile = null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    Object.keys(shopData).forEach((key) => {
      formData.append(key, shopData[key]);
    });
    return apiCallFormData(baseURL, token, `/api/shops/update/${id}`, formData, "PUT");
  },
  
  deleteShop: (baseURL, token, id) => 
    apiCall(baseURL, token, `/api/shops/remove/${id}`, {
      method: "DELETE",
    }),
  
  // Menu APIs
  getMenu: (baseURL, shopId) => 
    apiCall(baseURL, null, `/api/menu/view/${shopId}`, {
      method: "GET",
    }),
  
  addMenuItem: (baseURL, token, shopId, menuItemData, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    Object.keys(menuItemData).forEach((key) => {
      formData.append(key, menuItemData[key]);
    });
    return apiCallFormData(baseURL, token, `/api/menu/add/${shopId}`, formData, "POST");
  },
  
  updateMenuItem: (baseURL, token, shopId, itemId, menuItemData, imageFile = null) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    Object.keys(menuItemData).forEach((key) => {
      formData.append(key, menuItemData[key]);
    });
    return apiCallFormData(baseURL, token, `/api/menu/update/${shopId}/${itemId}`, formData, "PUT");
  },
  
  deleteMenuItem: (baseURL, token, shopId, itemId) => 
    apiCall(baseURL, token, `/api/menu/remove/${shopId}/${itemId}`, {
      method: "DELETE",
    }),
  
  // Category APIs
  listCategory: (baseURL) => 
    apiCall(baseURL, null, "/api/category/list", {
      method: "GET",
    }),
  
  singleCategory: (baseURL, id) => 
    apiCall(baseURL, null, `/api/category/single/${id}`, {
      method: "GET",
    }),
  
  addCategory: (baseURL, token, categoryData) => 
    apiCall(baseURL, token, "/api/category/add", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),
  
  editCategory: (baseURL, token, id, categoryData) => 
    apiCall(baseURL, token, `/api/category/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),
  
  deleteCategory: (baseURL, token, id) => 
    apiCall(baseURL, token, `/api/category/delete/${id}`, {
      method: "DELETE",
    }),

  // Order APIs
  getShopOrders: (baseURL, token) =>
    apiCall(baseURL, token, "/api/orders/my-shop", {
      method: "GET",
    }),
};
