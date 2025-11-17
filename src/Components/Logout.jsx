import { LogOut } from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const Logout = () => {
  const { setUser, navigate } = useAppContext();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="w-full group flex justify-center items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
      <LogOut className="w-5 h-5" /> Logout
    </button>
  );
};

export default Logout;