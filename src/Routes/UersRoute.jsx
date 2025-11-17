import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    const userStr = localStorage.getItem("user");
    
    if (!token) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Check if user exists and has role 0 (regular user)
        if (user && user.role === 0) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsAuthorized(false);
      }
    } else {
      // If no user data in localStorage but token exists, user is not authorized
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

export default UserRoute;
