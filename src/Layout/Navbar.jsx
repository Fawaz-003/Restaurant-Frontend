import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.png"
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { getCart, getCartItemCount } from "../utils/cartUtils";
import { useAppContext } from "../Context/AppContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePath, setProfilePath] = useState("/login");
  const [items, setItems] = useState(0);
  const { axios, user } = useAppContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      ? "text-red-600 font-semibold px-3 py-2 text-sm transition-colors duration-200"
      : "text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold block px-3 py-2 text-base transition-colors duration-200"
      : "text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium transition-colors duration-200";

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex justify-center align-center h-[40px] overflow-hidden">
            <img src={Logo} className="h-[230px] w-auto my-[-95px] mx-[-40px]" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/collections" className={navLinkClass}>
                Collections
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Heart Icon */}
            <NavLink to="/profile/wishlist" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Heart size={20} />
            </NavLink>
            {/* Cart Icon */}
            <NavLink
              to="/cart"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
            >
              <ShoppingCart size={20} />
              {items > 0 && (
                <span className="absolute -top-0 -right-0 bg-red-500 font-medium text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {items}
                </span>
              )}
            </NavLink>


            {/* User Icon (desktop) */}
            <div className="hidden md:flex items-center">
              <NavLink
                to={profilePath} // dynamic path here
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <User size={20} />
              </NavLink>
            </div>

            {/* Mobile Menu Button */}
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

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden ${
          isMenuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMenu}
        ></div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-4 py-4">
            <button
              onClick={toggleMenu}
              className="mb-2 p-5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="absolute right-6 top-5" />
            </button>

            <nav className="space-y-2">
              <NavLink
                to="/"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                About
              </NavLink>
              <NavLink
                to="/collections"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Collections
              </NavLink>
              <NavLink
                to="/contact"
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Contact
              </NavLink>

              {/* Profile link - also dynamic */}
              <NavLink
                to={profilePath}
                onClick={toggleMenu}
                className={mobileNavLinkClass}
              >
                Profile
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
