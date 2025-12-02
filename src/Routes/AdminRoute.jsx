import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';

const AdminRoute = () => {
  const { isAuthenticated, userData } = useAppContext();

  if (!isAuthenticated() || userData?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;