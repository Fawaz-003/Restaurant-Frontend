import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../Context/AppContext.jsx";
import Loading from "../../Components/Loading.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { axios, navigate, backendURL, setUser } = useAppContext();

  const getToastPosition = () => {
    if (window.innerWidth < 768) {
      return "top-center";
    }
    return "top-right";
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("user-token");
      const userStr = localStorage.getItem("user");
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.role === 1) {
            navigate("/admin/dashboard");
          } else if (user && user.role === 0) {
            navigate("/profile");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      setCheckingAuth(false);
    };

    checkAuthStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Please enter both email and password", {
        position: getToastPosition(),
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address", {
        position: getToastPosition(),
      });
      return;
    }
    setIsLoading(true);
    
    try {
      const res = await axios.post("/api/users/login", form);
      const data = res.data;

      localStorage.setItem("user-token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Ensure user profile exists (create if missing)
      const userId = data.user?._id || data.user?.id;
      if (userId) {
        try {
          await axios.post(`/api/profile/create/${userId}`);
        } catch (err) {
  
        }
      }

      toast.success(data.message, {
        position: getToastPosition(),
        autoClose: 1500,
      });
      setForm({ email: "", password: "" });

      setTimeout(() => {
        if (data.user.role === 1) navigate("/admin/dashboard");
        else navigate("/profile");
        setUser(data.user);
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Login failed",
        { position: getToastPosition() }
      );
      setForm({ email: "", password: "" });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#eff0f0] flex flex-col justify-center py-5 sm:px-5 lg:px-5">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white mx-3 py-8 px-4 shadow-sm rounded-lg sm:px-10 border border-gray-200">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-gray-600">Checking authentication...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eff0f0] flex flex-col justify-center py-5 sm:px-5 lg:px-5">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white mx-3 py-8 px-4  sm:px-10 ">
          <div className="sm:mx-auto mb-5 sm:w-full flex justify-center flex-col items-center m:max-w-md">
            <h2 className="text-2xl md:text-3xl text-gray-900 font-medium">Login</h2>
            <p className="text-center mt-2">
              Welcome back! Please login to continue.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-800" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-800" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-orange-600 hover:text-orange-500 transition duration-200"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex hover:cursor-pointer justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              {isLoading && <Loading message="Logging in..." variant="green" />}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800"
                onClick={() =>
                  window.open(`${backendURL}/api/users/google`, "_self")
                }
              >
                <img
                  className="h-4 w-4"
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
                  alt="googleFavicon"
                />
                Login with Google
              </button>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-medium text-orange-600 hover:text-orange-500 transition duration-200"
                >
                  Sign up
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;