import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider } from "./Context/AppContext";
import Footer from "./Layout/Footer";
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
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      
      <ToastContainer limit={3} />
      
      <main className="flex-grow">
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideNavAndFooter && <Footer />}

      {!hideBottomNav && <BottomNav />}

      {isMobileFilterOpen && (
        <MobileFilter
          onClose={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
