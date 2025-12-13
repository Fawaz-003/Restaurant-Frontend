import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import NotificationPopup from "../Components/Notifications/NotificationPopup";
import {
  MapPin,
  Menu,
  X,
  Heart,
  Package,
  Navigation,
  User,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token, userData } = useAppContext();
  const authenticated = isAuthenticated();
  const avatarLetter = userData?.name?.trim()?.charAt(0)?.toUpperCase() || "P";
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePath, setProfilePath] = useState("/login");
  const [currentLocation, setCurrentLocation] = useState("Select location");
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    if (token && location.pathname === "/login") {
      navigate("/profile", { replace: true });
    }
  }, [token, location.pathname, navigate]);

  // Update profile path based on authentication and role
  useEffect(() => {
    if (authenticated && userData) {
      if (userData.role?.toLowerCase() === "admin") {
        setProfilePath("/profile");
      } else if (userData.role?.toLowerCase() === "seller") {
        setProfilePath("/profile");
      } else {
        setProfilePath("/profile");
      }
    } else {
      setProfilePath("/login");
    }
  }, [authenticated, userData]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (authenticated) {
      navigate(profilePath);
    } else {
      navigate("/login");
    }
  };

  const handleViewDashboardClick = () => {
    if (userData?.role?.toLowerCase() === "admin") {
      navigate("/admin");
    } else if (userData?.role?.toLowerCase() === "seller") {
      navigate("/seller-dashboard");
    }
  };

  const handleDetectLocation = () => {
    if (isLocationLoading) return;

    if (!navigator.geolocation) {
      setCurrentLocation("Location not supported");
      return;
    }

    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
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
    handleDetectLocation();
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold px-3 py-2 text-sm transition-colors duration-200 flex items-center space-x-2"
      : "text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold block px-3 py-2 text-base transition-colors duration-200 flex items-center space-x-3"
      : "text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center space-x-3";

  return (
    <nav className="bg-white sticky top-0 z-50 p-2  border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo and location */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500 px-3 py-1 text-sm uppercase tracking-widest text-white">
                  My-Food
                </span>
                {/* <span className="text-lg font-bold text-slate-900">Marketplace</span> */}
              </Link>
            </div>

            {/* Location button - desktop */}
            <div className="hidden md:block">
              <button
                onClick={handleDetectLocation}
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

          {/* Right section - Navigation and actions */}
          <div className="flex items-center space-x-2">
            {/* Dashboard button for admin/seller */}
            {authenticated && (userData?.role?.toLowerCase() === "admin" || userData?.role?.toLowerCase() === "seller") && (
              <button
                onClick={handleViewDashboardClick}
                className="hidden h-9 items-center rounded-full border border-blue-300 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:inline-flex"
              >
                View Dashboard
              </button>
            )}

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {authenticated && (
                <>
                  <NavLink to="/Orders" className={navLinkClass}>
                    <Package size={18} />
                    <span>My Orders</span>
                  </NavLink>
                  <NavLink to="/Wishlist" className={navLinkClass}>
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </NavLink>
                  {/* <NotificationPopup /> */}
                </>
              )}
              
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-900 hover:text-red-600 transition-colors duration-200"
              >
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name || "Profile"}
                    className="h-6 w-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    {avatarLetter}
                  </span>
                )}
                <span>
                  {authenticated ? (userData?.name || "Profile") : "Login"}
                </span>
              </button>
            </div>

            {/* Mobile menu button */}
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

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden ${
          isMenuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        ></div>

        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">RestoMarket</span>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Location in mobile menu */}
            <div className="px-4 py-3 border-b border-gray-200">
              <button
                onClick={handleDetectLocation}
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
                {authenticated && (
                  <>
                    <NavLink
                      to="/Orders"
                      onClick={toggleMenu}
                      className={mobileNavLinkClass}
                    >
                      <Package size={18} />
                      <span>My Orders</span>
                    </NavLink>
                    <NavLink
                      to="/Wishlist"
                      onClick={toggleMenu}
                      className={mobileNavLinkClass}
                    >
                      <Heart size={18} />
                      <span>Wishlist</span>
                    </NavLink>
                    {/* <div className="px-3 py-2">
                      <NotificationPopup />
                    </div> */}
                  </>
                )}

                {authenticated && (userData?.role?.toLowerCase() === "admin" || userData?.role?.toLowerCase() === "seller") && (
                  <button
                    onClick={() => {
                      handleViewDashboardClick();
                      toggleMenu();
                    }}
                    className="w-full text-gray-900 hover:text-gray-600 px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center space-x-3"
                  >
                    <span>View Dashboard</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    handleProfileClick();
                    toggleMenu();
                  }}
                  className="w-full text-gray-900 hover:text-gray-600 px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center space-x-3"
                >
                  <User size={18} />
                  <span>{authenticated ? (userData?.name || "Profile") : "Login"}</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;