import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Collections from "./Pages/Collections";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Login from "./Pages/Users/Login";
import Register from "./Pages/Users/Register";
import UserProfile from "./Pages/Users/UserProfile/UserProfileLayout";
import PersonalInfo from "./Pages/Users/UserProfile/UserMenuItems/PersonalInfo";
import Wishlist from "./Pages/Users/UserProfile/UserMenuItems/UserWishlist";
import Orders from "./Pages/Users/UserProfile/UserMenuItems/UserOrders";
import Addresses from "./Pages/Users/UserProfile/UserMenuItems/UserAddresses";
import Returns from "./Pages/Users/UserProfile/UserMenuItems/UserReturns";
import Payments from "./Pages/Users/UserProfile/UserMenuItems/UserPayments";
import Reviews from "./Pages/Users/UserProfile/UserMenuItems/UserReviews";
import Coupons from "./Pages/Users/UserProfile/UserMenuItems/UserCoupons";
import Notifications from "./Pages/Users/UserProfile/UserMenuItems/UserNotification";

import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import BottomNav from "./Layout/BottomNav";
import MobileFilter from "./Layout/MobileFilter";

import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./Pages/Admin/AdminPages/AdminDashboard";
import AdminProducts from "./Pages/Admin/AdminPages/AdminProducts";
import AdminOrders from "./Pages/Admin/AdminPages/AdminOrders";
import AdminUsers from "./Pages/Admin/AdminPages/AdminUsers";
import AdminMenu from "./Pages/Admin/Components/AdminMenu";
import AddProducts from "./Pages/Admin/Actions/AddProducts";
import EditProducts from "./Pages/Admin/Actions/EditProducts";
import AdminSettings from "./Pages/Admin/AdminPages/AdminSettings";
import AdminCategory from "./Pages/Admin/AdminPages/AdminCategory";
import AddCategory from "./Pages/Admin/Actions/AddCategory";
import EditCategory from "./Pages/Admin/Actions/EditCategory";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRoute from "./Routes/UersRoute";
import { useAppContext } from "./Context/AppContext";
import ProductDetail from "./Layout/ProductDetail";
import AuthSuccess from "./Pages/Users/AuthSuccess";
import Checkout from "./Pages/Checkout";
import ShopMenu from "./Pages/ShopMenu";

const App = () => {
  const location = useLocation();
  const { axios } = useAppContext();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const hideNavAndFooter = location.pathname.startsWith("/admin");
  const hideBottomNav =
    location.pathname.startsWith("/admin") ||
    isMobileFilterOpen;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/ping`)
      .then(() => console.log("Backend pre-warmed"))
      .catch((err) => console.log("Pre-warm failed:", err));
  }, []);

    useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "auto";
  }, [isMobileFilterOpen]);

  return (
    <div className="relative min-h-screen pb-16">
      {!hideNavAndFooter && <Navbar />}
      <ToastContainer limit={3} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
           <Route path="shop/:id" element={<ShopMenu />} />
        <Route path="/collections" element={<Collections setIsMobileFilterOpen={setIsMobileFilterOpen} />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <UserProfile />
            </UserRoute>
          }
        >
          <Route index element={<Navigate to="personal-information" replace />} />
          <Route path="personal-information" element={<PersonalInfo />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="my-orders" element={<Orders />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="returns-refunds" element={<Returns />} />
          <Route path="payment-methods" element={<Payments />} />
          <Route path="my-reviews" element={<Reviews />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminMenu />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products">
            <Route index element={<AdminProducts />} />
            <Route path="add" element={<AddProducts />} />
            <Route path="edit/:id" element={<EditProducts />} />
          </Route>
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="categories">
            <Route index element={<AdminCategory />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="editcategory/:id" element={<EditCategory />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer */}
      {!hideNavAndFooter && <Footer />}

      {/* Bottom Navigation */}
      {!hideBottomNav && <BottomNav />}
      <BottomNav hidden={isMobileFilterOpen || hideBottomNav} />


      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <MobileFilter
          onClose={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
