import React, { useState } from "react";
import { Bell, MessageSquare, Search, User, ChevronDown } from "lucide-react";

const AdminNavbar = () => {
  const [profileDropdown, setProfileDropdown] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="w-full bg-white shadow-lg border-b border-gray-200 px-6 py-3 lg:px-25 flex items-center justify-between fixed top-0 left-0 z-50 h-16">
    
      <div className="flex items-center">
        <div className="text-2xl font-bold text-gray-800">
          Mode<span className="text-red-600">X</span>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <button className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <Search size={20} />
        </button>

        <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            0
          </span>
        </button>

        <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <MessageSquare size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            0
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <ChevronDown size={16} className="hidden sm:block" />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Account Settings
              </a>
              <div className="border-t border-gray-100 mt-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;