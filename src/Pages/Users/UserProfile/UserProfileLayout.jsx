import { useState, useEffect } from "react";
import {
  User2,
  Heart,
  ShoppingBag,
  Truck,
  Package,
  CreditCard,
  Star,
  Gift,
  Bell,
  ChevronRight,
  User,
  Menu,
  X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import Logout from "../../../Components/Logout";

const UserProfile = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { axios } = useAppContext();
 
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        const userId = storedUser._id || storedUser.id;
 
        if (userId) {
          const profileRes = await axios.get(`/api/profile/${userId}`);
          const profile = profileRes.data.profile;
          setUser({
            ...storedUser,
            name: profile.name || storedUser.name,
            avatar: profile.avatar || storedUser.avatar,
          });
        } else {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to local storage user if profile fetch fails
        setUser(JSON.parse(localStorage.getItem("user")) || {});
      } finally {
        setLoading(false);
      }
    };
 
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sidebar items: label + route slug + icon
  const menuItems = [
    { icon: User2, label: "Personal Information", slug: "personal-information" },
    { icon: Heart, label: "Wishlist", slug: "wishlist" },
    { icon: ShoppingBag, label: "My Orders", slug: "my-orders" },
    { icon: Truck, label: "Addresses", slug: "addresses" },
    { icon: Package, label: "Returns & Refunds", slug: "returns-refunds" },
    { icon: CreditCard, label: "Payment Methods", slug: "payment-methods" },
    { icon: Star, label: "My Reviews", slug: "my-reviews" },
    { icon: Gift, label: "Gift Cards & Coupons", slug: "coupons" },
    { icon: Bell, label: "Notifications", slug: "notifications" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Sticky Sidebar */}
          <div className="md:col-span-1 lg:sticky lg:top-24 self-start">
            <div className="flex flex-col h-full">
              <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {imagePreview || user.avatar ? (
                        <img
                          src={imagePreview || user.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-600">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Hello,</p>
                    <p className="font-semibold text-gray-900">
                      {user.name || "Guest User"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden bg-white rounded-lg shadow-sm mb-4">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-full p-3 flex items-center justify-between text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <span>My Account Menu</span>
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              {/* Menu Items Container */}
              <div
                className={`bg-white rounded-lg shadow-sm overflow-hidden flex-grow ${
                  isMenuOpen ? "block" : "hidden"
                } md:block`}
              >
                <div className="max-h-[calc(100vh-350px)] overflow-y-auto divide-y divide-gray-100 md:max-h-full">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.slug}
                      to={`/profile/${item.slug}`}
                      onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                      className={({ isActive }) =>
                        `p-3 flex items-center justify-between group transition-all duration-100 ${
                          isActive
                            ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                            : "hover:bg-gray-50"
                        }`
                      }
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </NavLink>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <Logout />
                </div>
              </div>
            </div>
          </div>

          {/* Main content area (nested routes will render here) */}
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
