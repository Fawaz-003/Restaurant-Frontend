import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./Context/AppContext";
import Footer from "./Layout/Footer";
import Navbar from "./Layout/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AuthCallback from "./Hooks/AuthCallback";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import SellerDashboard from "./Pages/Seller/SellerDashboard"; // Corrected path
import Profile from "./Pages/User/Profile";
import Register from "./Pages/Register";
import ShopPage from "./Shop";

const App = () => {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop/:id" element={<ShopPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default App;
