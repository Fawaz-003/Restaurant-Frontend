import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../Context/AppContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { axios, navigate, backendURL } = useAppContext();

  const getToastPosition = () => {
    if (window.innerWidth < 768) {
      return "top-center";
    }
    return "top-right";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/users/register", form, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      toast.success(data.message, {
        position: getToastPosition(),
      });
      navigate("/login");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed",
        {
          position: getToastPosition(),
        }
      );

      setForm({ name: "", email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-5 px-4 sm:px-10 ">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-5 text-center text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Sign-up
            </h2>
          <p className="mt-2 text-center">
            Create your account to get started.
          </p>
          </div>
          <div className="space-y-3 mt-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Create a password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Create Account Button */}
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 transition duration-200"
              >
                Create Account
              </button>
            </div>

            {/* Social Login Buttons */}
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
                Signup with Google
              </button>
            </div>
          </div>

          {/* Sign in link */}
          <div className="mt-2">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-orange-600 hover:text-orange-500 transition duration-200"
                >
                  Login
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;