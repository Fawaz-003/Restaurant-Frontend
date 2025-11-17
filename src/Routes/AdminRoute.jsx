import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user?.role === 1) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default AdminRoute;
