import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Heart, MapPin, Package, Navigation } from "lucide-react";
import { getCart, getCartItemCount } from "../utils/cartUtils";
import { useAppContext } from "../Context/AppContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePath, setProfilePath] = useState("/login");
  const [items, setItems] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("Select location");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { axios, user } = useAppContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to request location permission
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation("Geolocation not supported");
      return;
    }

    setIsLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.address) {
            const { city, town, village, county, state, suburb } = data.address;
            const locationName = city || town || village || suburb || county || state || "Unknown location";
            setCurrentLocation(locationName);
          } else {
            setCurrentLocation("Location not found");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          setCurrentLocation("Location error");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setCurrentLocation("Location denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setCurrentLocation("Location unavailable");
            break;
          case error.TIMEOUT:
            setCurrentLocation("Location timeout");
            break;
          default:
            setCurrentLocation("Location error");
        }
        setIsLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Try to get location on component mount
  useEffect(() => {
    requestLocation();
  }, []);

  // update profilePath whenever token/user changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("user-token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (token && user) {
        if (user.role === 0) {
          setProfilePath("/profile");
        } else if (user.role === 1) {
          setProfilePath("/admin/dashboard");
        } else {
          setProfilePath("/login");
        }
      } else {
        setProfilePath("/login");
      }
    };
    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Update cart count on mount and when cart changes
  useEffect(() => {
    const updateCartCount = async () => {
      const cart = await getCart(axios);
      setItems(getCartItemCount(cart));
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, [user, axios]);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold px-3 py-2 text-sm transition-colors duration-200 flex items-center space-x-2"
      : "text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold block px-3 py-2 text-base transition-colors duration-200 flex items-center space-x-3"
      : "text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center space-x-3";

  return (
    <nav className="bg-white sticky top-0 z-50 p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-gray-900">My-Food</span>
            </div>

            <div className="hidden md:block">
              <button
                onClick={requestLocation}
                disabled={isLocationLoading}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 disabled:opacity-50 w-64"
              >
                <MapPin size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1 text-left truncate">
                  {isLocationLoading ? "Getting location..." : currentLocation}
                </span>
                <Navigation size={14} className="text-gray-500 flex-shrink-0" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/profile/my-orders" className={navLinkClass}>
                <Package size={18} />
                <span>My Orders</span>
              </NavLink>
              <NavLink to="/profile/wishlist" className={navLinkClass}>
                <Heart size={18} />
                <span>Wishlist</span>
              </NavLink>
              <NavLink to={profilePath} className={navLinkClass}>
                <User size={18} />
                <span>Profile</span>
              </NavLink>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex md:hidden ${isMenuOpen ? "" : "pointer-events-none"
          }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={toggleMenu}
        ></div>

        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">My-Food</span>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-200">
              <button
                onClick={requestLocation}
                disabled={isLocationLoading}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 disabled:opacity-50"
              >
                <MapPin size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1 text-left truncate">
                  {isLocationLoading ? "Getting location..." : currentLocation}
                </span>
                <Navigation size={14} className="text-gray-500 flex-shrink-0" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-1">
                <NavLink
                  to="/profile/my-orders"
                  onClick={toggleMenu}
                  className={mobileNavLinkClass}
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </NavLink>
                <NavLink
                  to="/profile/wishlist"
                  onClick={toggleMenu}
                  className={mobileNavLinkClass}
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
                </NavLink>
                <NavLink
                  to={profilePath}
                  onClick={toggleMenu}
                  className={mobileNavLinkClass}
                >
                  <User size={18} />
                  <span>Profile</span>
                </NavLink>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;