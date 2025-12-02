import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./Context/AppContext";
import Footer from "./Layout/Footer";
import Navbar from "./Layout/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AuthCallback from "./Hooks/AuthCallback";
import AdminDashboard, { menuItems } from "./Pages/Admin/AdminDashboard";
import SellerDashboard from "./Pages/Seller/SellerDashboard";
import Profile from "./Pages/User/Profile";
import Register from "./Pages/Register";
import ShopMenu from "./Pages/ShopMenu";
import Checkout from "./Pages/CheckOut";
import AppForUs from "./Components/Footer/AppForUs";
import PartnersWithUs from "./Components/Footer/PartnerWithUs";
import FraudAndSupport from "./Components/Footer/FraudAndSuppport";
import HelpCenter from "./Components/Footer/HelpCenter";
import Privacy from "./Components/Footer/Privacy";
import TermsandConditions from "./Components/Footer/TermsandConditions";
import AdminRoute from "./Routes/AdminRoute";
// import Security from "./Components/Footer/Security"

const App = () => {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              {menuItems.map((item) => (
                <Route
                  key={item.path}
                  path={item.path.substring("/admin/".length)}
                  element={<item.component />}
                />
              ))}
            </Route>
          </Route>
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shop/:id" element={<ShopMenu />} />
          <Route path="/partnerwithus" element={<PartnersWithUs />} />
          <Route path="/appforus" element={<AppForUs />} />
          {/* <Route path="/security" element={<Security />} /> */}
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms&conditions" element={<TermsandConditions />} />
          <Route path="/Helpcenter" element={<HelpCenter />} />
          <Route path="/reportfraud" element={<FraudAndSupport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default App;
