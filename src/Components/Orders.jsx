import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle, Clock, MapPin, ChevronRight, Calendar, XCircle, RotateCcw } from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import CancelOrderModal from "./Orders/CancelOrderModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, order: null });
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();
  const { userData, token, baseURL } = useAppContext();

  const ordersKey = userData?._id ? `orders_${userData._id}` : "orders_guest";
  const cartKey = userData?._id ? `cart_${userData._id}` : "cart_guest";

  const normalizeOrders = (rawOrders = []) =>
    rawOrders.map((order) => {
      const firstItem = order?.items?.[0] || {};
      const restaurantSource =
        order.restaurantInfo || order.shopInfo || order.shop || {};

      const restaurantInfo = {
        id: restaurantSource.id || restaurantSource._id || order.shopId || firstItem.shopId,
        name:
          restaurantSource.name ||
          restaurantSource.storeName ||
          restaurantSource.title ||
          firstItem.shopName ||
          order.restaurant ||
          "Restaurant",
        image:
          restaurantSource.image?.url ||
          restaurantSource.image ||
          firstItem.shopImage ||
          firstItem.image ||
          "",
        address:
          restaurantSource.address ||
          restaurantSource.location?.address ||
          restaurantSource.location?.title ||
          order.restaurantAddress ||
          order.deliveryAddress ||
          order.address ||
          "",
      };

      return {
        ...order,
        id: order.orderId || order.id || restaurantInfo.id || `ORD-${Date.now()}`,
        orderId: order.orderId || order.id,
        total: order.totalAmount ?? order.total ?? 0,
        status: order.deliveryStatus || order.orderStatus || order.status || "Pending",
        orderStatus: order.orderStatus || "Pending",
        deliveryStatus: order.deliveryStatus || "Pending",
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : order.date || "",
        deliveryTime: order.deliveryTime || "Estimated soon",
        address: order.deliveryAddress || order.address || firstItem.deliveryAddress || "",
        restaurantInfo,
        shopId: order.shopId || restaurantInfo.id,
        items: (order.items || []).map((item) => ({
          ...item,
          image:
            item.image?.url ||
            item.image ||
            item.img ||
            item.productImage ||
            item.photo ||
            item.thumbnail ||
            item.product?.image ||
            item.shopImage ||
            restaurantInfo.image ||
            "",
          name: item.name || item.title || item.productName || "Item",
          price: item.price ?? item.amount ?? item.cost ?? 0,
          quantity: item.quantity ?? item.qty ?? 1,
        })),
      };
    });

  const fetchOrders = async () => {
    if (!token || !baseURL) {
      setOrders([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${baseURL}/api/users/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(normalizeOrders(res.data?.orders || []));
    } catch (err) {
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, baseURL]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleCancelOrder = async (reason) => {
    if (!cancelModal.order) return;

    try {
      setCancelling(true);
      // Use orderId from the order object
      const orderId = cancelModal.order.orderId || cancelModal.order.id;
      const res = await axios.put(
        `${baseURL}/api/users/orders/${orderId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        showToast("Order cancelled successfully. Admin and seller have been notified.");
        setCancelModal({ isOpen: false, order: null });
        // Refresh orders
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      const errorMsg = error.response?.data?.message || "Failed to cancel order";
      showToast(errorMsg);
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = (order) => {
    const status = order.deliveryStatus || order.orderStatus || order.status || "Pending";
    return status !== "Delivered" && status !== "Cancelled";
  };

  const canReturnOrder = (order) => {
    const status = order.deliveryStatus || order.orderStatus || order.status || "Pending";
    return status === "Delivered";
  };

  const handleAddItemToCart = (item, order) => {
    if (!item) return;

    const productKey =
      item.productId || item.id || item._id || item.sku || `${item.name}-${item.price}`;

    const cartItem = {
      ...item,
      quantity: item.quantity || 1,
      id: item.id || item._id || productKey,
      productId: item.productId || item._id || item.id || null,
      shopId: order?.restaurantInfo?.id || item.shopId,
      shopName: order?.restaurantInfo?.name || item.shopName,
      shopImage: order?.restaurantInfo?.image || item.shopImage,
    };

    const existingCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const updatedCart = [...existingCart];

    const matchIndex = updatedCart.findIndex((c) => {
      const cKey = c.productId || c.id || c._id || `${c.name}-${c.price}`;
      return cKey === productKey;
    });

    if (matchIndex >= 0) {
      const current = updatedCart[matchIndex];
      updatedCart[matchIndex] = {
        ...current,
        quantity: (current.quantity || 1) + (cartItem.quantity || 1),
      };
    } else {
      updatedCart.push(cartItem);
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    showToast(`${cartItem.name || "Item"} added to cart`);
  };

  const handleAddToCart = (order) => {
    if (!order?.items?.length) return;
    const newCart = order.items.map((item) => ({ ...item }));
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    navigate("/checkout", {
      state: {
        cart: newCart,
        preserveCart: true,
        from: "/Orders",
        shopInfo: order.restaurantInfo || null,
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "bg-green-100 text-green-800",
      "Out for Delivery": "bg-purple-100 text-purple-800",
      Processing: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
      Shipped: "bg-indigo-100 text-indigo-800",
      Pending: "bg-yellow-100 text-yellow-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    return status === "Delivered" ? 
      <CheckCircle className="w-4 h-4" /> : 
      <Clock className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Track and manage all your orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          {orders.length === 0 ? (
            <div className="text-center py-10 sm:py-12 lg:py-16 bg-white rounded-xl sm:rounded-2xl shadow-sm mx-2 sm:mx-0">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">Start shopping to see your orders here!</p>
              <button
                onClick={() => navigate("/")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition text-sm sm:text-base"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                          <h2 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                            Order #{order.id.length > 20 ? `${order.id.substring(0, 20)}...` : order.id}
                          </h2>
                          <span className={`px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 ${getStatusColor(order.status)} w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="truncate">{order.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="truncate">{order.deliveryTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{order.total}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">Items Ordered</h3>
                    <span className="text-xs sm:text-sm text-gray-600">{order.items.length} items</span>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => handleAddItemToCart(item, order)}
                      >
                        {/* Item Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 rounded-lg flex items-center justify-center">
                              <span className="text-xl sm:text-2xl">🍛</span>
                            </div>
                          )}
                          <div className="absolute -top-1.5 -left-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {item.name}
                          </h4>
                          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mt-1.5 sm:mt-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm text-gray-600">₹{item.price} each</span>
                              <span className="text-gray-300 hidden xs:inline">•</span>
                              <span className="text-xs sm:text-sm font-medium text-gray-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddItemToCart(item, order);
                              }}
                              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition w-fit"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Address */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Delivery Address</h4>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-lg break-words">
                        {order.address}
                      </p>
                    </div>

                    <div className="mt-4 lg:mt-0">
                      <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Restaurant Details</h4>
                      <div className="flex items-start sm:items-center gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {order.restaurantInfo?.image || order.items?.[0]?.image ? (
                            <img
                              src={order.restaurantInfo?.image || order.items?.[0]?.image}
                              alt={order.restaurantInfo?.name || order.restaurant || "Restaurant"}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-lg sm:text-xl">🏪</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {order.restaurantInfo?.name || order.restaurant || "Restaurant"}
                          </p>
                          {(order.restaurantInfo?.address || order.address) && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                              {order.restaurantInfo?.address || order.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleAddToCart(order)}
                      className="px-4 py-2 sm:px-5 sm:py-2.5 border border-orange-600 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition text-sm sm:text-base flex-1 sm:flex-none min-w-[120px]"
                    >
                      Order Again
                    </button>
                    
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => setCancelModal({ isOpen: true, order })}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition text-sm sm:text-base flex-1 sm:flex-none min-w-[120px] flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Order
                      </button>
                    )}
                    
                    {canReturnOrder(order) && (
                      <button
                        onClick={() => {
                          // For now, show a message. Can implement return functionality later
                          showToast("Return functionality coming soon!");
                        }}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition text-sm sm:text-base flex-1 sm:flex-none min-w-[120px] flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Return Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-4 text-[11px] sm:bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg sm:text-[14px] z-50 mx-2 sm:mx-0 max-w-[90vw] sm:max-w-none">
          {toast.message}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, order: null })}
        onConfirm={handleCancelOrder}
        orderId={cancelModal.order?.orderId || cancelModal.order?.id}
        isLoading={cancelling}
      />
    </div>
  );
};

export default Orders;