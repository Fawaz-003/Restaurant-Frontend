import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { createApiFunctions } from "../Services/Api";

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

  // ================== API helpers ================== //
  const api = useMemo(() => createApiFunctions(baseURL, token), [baseURL, token]);

  // ================== Shops state ================== //
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState(null);

  const fetchShops = useCallback(async () => {
    if (!baseURL) return;
    setShopsLoading(true);
    setShopsError(null);
    try {
      const response = await api.getAllShops();
      const data = response?.data ?? response;
      setShops(Array.isArray(data) ? data : []);
    } catch (error) {
      setShopsError(error.message || "Failed to load shops");
      setShops([]);
    } finally {
      setShopsLoading(false);
    }
  }, [api, baseURL]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // ================== Menu state ================== //
  const [menus, setMenus] = useState({});
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);

  // ================== Wishlist state ================== //
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  const fetchMenuByShop = useCallback(
    async (shopId, { force = false } = {}) => {
      if (!shopId || !baseURL) return [];
      if (!force && menus[shopId]) return menus[shopId];

      setMenuLoading(true);
      setMenuError(null);
      try {
        const response = await api.getMenu(shopId);
        const data = response?.data ?? response;
        const normalizedMenu = Array.isArray(data) ? data : [];
        setMenus((prev) => ({ ...prev, [shopId]: normalizedMenu }));
        return normalizedMenu;
      } catch (error) {
        setMenuError(error.message || "Failed to load menu");
        throw error;
      } finally {
        setMenuLoading(false);
      }
    },
    [api, baseURL, menus]
  );

  const fetchWishlist = useCallback(async () => {
    if (!baseURL || !token) {
      setWishlist([]);
      return [];
    }
    setWishlistLoading(true);
    setWishlistError(null);
    try {
      const response = await api.getWishlist();
      const list = response?.wishlist || response?.data || [];
      setWishlist(Array.isArray(list) ? list : []);
      return list;
    } catch (error) {
      setWishlistError(error.message || "Failed to load wishlist");
      setWishlist([]);
      return [];
    } finally {
      setWishlistLoading(false);
    }
  }, [api, baseURL, token]);

  const toggleWishlistItem = useCallback(
    async (item) => {
      if (!token) {
        throw new Error("Please login to manage wishlist");
      }

      const payload = {
        productId: item.productId || item.id || item._id,
        name: item.name || item.foodName || item.title || "Item",
        price: item.price ?? item.amount ?? 0,
        image: item.image?.url || item.image || "",
        description: item.description || "",
        rating: item.rating ?? 0,
        shopId: item.shopId || item.restaurantId || item.restaurantInfo?.id,
        shopName: item.shopName || item.restaurantInfo?.name,
        shopImage: item.shopImage || item.restaurantInfo?.image,
      };

      const response = await api.toggleWishlist(payload);
      const list = response?.wishlist || response?.data || [];
      setWishlist(Array.isArray(list) ? list : []);
      return list;
    },
    [api, token]
  );

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

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
    shops,
    shopsLoading,
    shopsError,
    fetchShops,
    menus,
    menuLoading,
    menuError,
    fetchMenuByShop,
    wishlist,
    wishlistLoading,
    wishlistError,
    fetchWishlist,
    toggleWishlistItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

