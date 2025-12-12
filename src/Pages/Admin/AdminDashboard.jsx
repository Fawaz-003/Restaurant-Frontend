import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Layers, Users, List, Bell } from 'lucide-react';
import DashboardHome from './Actions/DashboardHome';
import ShopManagement from './Actions/ShopManagement';
import CategoryManagement from './Actions/CategoryManagement';
import UserManagement from './Actions/UserManagement';
import NotificationSidebar from '../../Components/Notifications/NotificationSidebar';

export const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, component: DashboardHome },
  { path: '/admin/shops', label: 'Manage Shops', icon: ShoppingCart, component: ShopManagement },
  { path: '/admin/categories', label: 'Manage Categories', icon: Layers, component: CategoryManagement },
  { path: '/admin/users', label: 'Manage Users', icon: Users, component: UserManagement },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 self-start sticky top-24">
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm h-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="px-3 text-xs font-semibold uppercase text-slate-500">
                  Admin Menu
                </h3>
                <button
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative p-2 text-slate-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-slate-50"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      location.pathname.startsWith(item.path)
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      
      {/* Notification Sidebar */}
      <NotificationSidebar 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  );
};

export default AdminDashboard;