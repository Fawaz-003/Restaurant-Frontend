import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { useApi } from "../Services/Api";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUserData, baseURL } = useAppContext();
  const { loginUser, googleAuth } = useApi();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(form);
      if (response?.token) {
        setToken(response.token);
      }
      if (response?.user) {
        setUserData(response.user);
      }
      navigate("/profile", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message || "Failed to sign in. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!baseURL) {
      setError("Missing backend URL. Please set VITE_BACKEND_URL.");
      return;
    }
    googleAuth();
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Demo authentication only. Use any email/password combination.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-3 grid grid-cols-1 gap-3">
          <button
            type="button"
            className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800"
            onClick={handleGoogleLogin}
            disabled={!baseURL}
          >
            <img
              className="h-4 w-4"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
              alt="googleFavicon"
            />
            Log in with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to the platform?{" "}
          <Link to="/register" className="font-semibold text-amber-600">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
