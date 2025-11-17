import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, User2Icon } from "lucide-react";

const BottomNav = ({ hidden }) => {
  const [profilePath, setProfilePath] = useState("/login");

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

    // optional: listen to storage events across tabs
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "flex justify-between items-center flex-col text-red-600 font-semibold block px-3 py-2 text-base"
      : "flex justify-between items-center flex-col text-gray-900 hover:text-gray-600 block px-3 py-2 text-base font-medium transition-colors duration-200";


  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 sm:hidden z-40 bottom-navbar">
      <div className="flex justify-around items-center h-16">
        <NavLink to="/" className={mobileNavLinkClass}>
          <Home />
          <p className="text-sm">Home</p>
        </NavLink>
        <NavLink to="/collections" className={mobileNavLinkClass}>
          <LayoutDashboard />
          <p className="text-sm">Collections</p>
        </NavLink>
        <NavLink to={profilePath} className={mobileNavLinkClass}>
          <User2Icon />
          <p className="text-sm">Profile</p>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
