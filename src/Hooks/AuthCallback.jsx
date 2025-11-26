import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setToken, setUserData } = useAppContext();
  const [status, setStatus] = useState("Completing sign in...");
  const [error, setError] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userParam = searchParams.get("user");

    if (!userParam) {
      setError("Missing user information in callback.");
      setStatus("Unable to complete Google sign in.");
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(userParam));

      if (decoded?.token) {
        setToken(decoded.token);
      } else {
        throw new Error("Missing token in response.");
      }

      if (decoded) {
        setUserData({
          _id: decoded._id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          avatar: decoded.avatar,
        });
      }

      setStatus("Signed in successfully. Redirecting...");
      navigate("/profile", { replace: true });
    } catch (callbackError) {
      console.error("Auth callback error", callbackError);
      setError(callbackError.message || "Unexpected error");
      setStatus("Unable to complete Google sign in.");
    }
  }, [navigate, setToken, setUserData]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">{status}</p>
        {error && (
          <p className="mt-4 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default AuthCallback;


