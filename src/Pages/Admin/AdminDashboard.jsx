import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Layers, Users, List } from 'lucide-react';
import DashboardHome from './Actions/DashboardHome';
import ShopManagement from './Actions/ShopManagement';
import CategoryManagement from './Actions/CategoryManagement';
import UserManagement from './Actions/UserManagement';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: DashboardHome },
  { id: 'shops', label: 'Manage Shops', icon: ShoppingCart, component: ShopManagement },
  { id: 'categories', label: 'Manage Categories', icon: Layers, component: CategoryManagement },
  { id: 'users', label: 'Manage Users', icon: Users, component: UserManagement },
];

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const ActiveComponent = menuItems.find(item => item.id === activeView)?.component || DashboardHome;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Sidebar */}
          <aside className="md:col-span-3 lg:col-span-2">
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="px-3 text-xs font-semibold uppercase text-slate-500">
                Admin Menu
              </h3>
              <nav className="flex flex-col">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      activeView === item.id
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
          <main className="md:col-span-9 lg:col-span-10">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;