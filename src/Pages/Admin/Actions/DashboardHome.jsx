import React from 'react';
import { ShoppingCart, Users, Layers, List } from 'lucide-react';

const DashboardHome = () => {
  const stats = [
    { name: 'Shops', icon: ShoppingCart, value: 'Manage restaurant listings' },
    { name: 'Users', icon: Users, value: 'Oversee user accounts and roles' },
    { name: 'Categories', icon: Layers, value: 'Organize menu categories' },
    { name: 'Menus', icon: List, value: 'Edit menus for each shop' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Welcome to the central hub for managing the Resto Marketplace platform.
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
