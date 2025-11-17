import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Menu,
  X,
  Settings,
  BookCopy,
} from "lucide-react";
import Logout from "../../../Components/Logout";

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: LayoutDashboard,
      
    },
    {
      name: "Products",
      path: "products",
      icon: Package,
    },
    {
      name: "Users",
      path: "users",
      icon: Users,
      
    },
    {
      name: "Orders",
      path: "orders",
      icon: ShoppingBag,
    },
    {
      name: "Settings",
      path: "settings",
      icon: Settings,
    },
    {
      name: "Categories",
      path: "categories",
      icon: BookCopy,
    }
  ];

  const isActiveLink = (path) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {sidebarOpen ? (
          <X size={20} className="text-gray-600" />
        ) : (
          <Menu size={20} className="text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transform transition-transform duration-300 ease-in-out z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="text-lg font-semibold text-gray-900">
                {user?.name}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  size={18}
                  className={`mr-3 ${
                    isActive ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center mt-3">
            <Logout />
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;