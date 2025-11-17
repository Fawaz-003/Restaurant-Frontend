import { createContext, useMemo, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosLib from "axios";
import { syncLocalCartToBackend } from "../utils/cartUtils";

export const AppContext = createContext({
  user: null,
  setUser: () => {},
  wishlist: [],
  fetchWishlist: async () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  backendURL: "",
});

// Normalize user object to always have _id (for backward compatibility)
const normalizeUser = (user) => {
  if (!user) return null;
  // If user has id but not _id, convert id to _id (create new object to avoid mutation)
  if (user.id && !user._id) {
    const { id, ...rest } = user;
    return { ...rest, _id: id };
  }
  return user;
};

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return normalizeUser(parsedUser);
  });
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const axios = useMemo(() => {
    return axiosLib.create({
      baseURL: backendURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }, [backendURL]);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("user-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [axios]);

  const fetchWishlist = useCallback(async () => {
    if (!user?._id) {
      setWishlist([]);
      return;
    }
    try {
      const res = await axios.get(`/api/profile/${user._id}`);
      const wishlistItems = res.data.profile.wishlist || [];
      // The wishlist from the profile can be an array of objects or strings.
      // We need to handle both cases to get the product ID.
      setWishlist(
        wishlistItems.map((item) => (typeof item === 'object' && item.product ? item.product : item))
      );
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setWishlist([]);
    }
  }, [axios, user]);

  const addToWishlist = useCallback(async (productId) => {
    if (!user?._id) return;
    try {
      await axios.post(`/api/wishlist/add/${user._id}`, { productId });
      setWishlist((prev) => [...new Set([...prev, productId])]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // Optionally, revert state if API call fails
    }
  }, [axios, user]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!user?._id) return;
    try {
      await axios.delete(`/api/wishlist/remove/${user._id}`, { data: { productId } });
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Optionally, revert state if API call fails
    }
  }, [axios, user]);

  useEffect(() => {
    if (user) {
      // Normalize user to ensure _id is always present (for backward compatibility)
      const normalizedUser = normalizeUser(user);
      
      // If normalization changed the structure (id -> _id), update state and return
      // The effect will run again with the normalized user
      if (user.id && !user._id) {
        setUser(normalizedUser);
        return;
      }
      
      // User is already normalized, proceed with storage and wishlist fetch
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      fetchWishlist();

      // If user just logged in and there's a local cart, sync it.
      const localCart = localStorage.getItem('local-cart');
      if (localCart) {
        syncLocalCartToBackend(axios);
      }
    } else {
      localStorage.removeItem("user");
      setWishlist([]);
    }
  }, [user, fetchWishlist, axios]);

  const value = useMemo(
    () => ({
      user, setUser, axios, navigate, backendURL, wishlist, fetchWishlist, addToWishlist, removeFromWishlist
    }),
    [user, axios, navigate, backendURL, wishlist, fetchWishlist, addToWishlist, removeFromWishlist]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
