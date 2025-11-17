import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext.jsx";
import { toast } from "react-toastify";

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, axios } = useAppContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("user-token", token);

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Logged in with Google!", {
          position: "top-right",
          style: { margin: "45px" },
        });
        if (user.role === 1) navigate("/admin/dashboard");
        else navigate("/profile");
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Google login failed");
        navigate("/login");
      }
    };

    fetchUser();
  }, [location, navigate, axios, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700">Completing login...</p>
    </div>
  );
};

export default AuthSuccess;
