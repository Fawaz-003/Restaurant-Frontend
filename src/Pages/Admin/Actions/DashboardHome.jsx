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
    <div className="-m-6"> {/* Use negative margin to counteract parent padding if needed, or just an empty div */}
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h2>
      <p className="mt-1 text-sm text-slate-500">
        Welcome to the central hub for managing the Resto Marketplace platform.
      </p>
    </div>
  );
};

export default DashboardHome;