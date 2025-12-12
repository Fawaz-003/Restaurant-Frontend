import { useState, useEffect } from "react";
import { Bell, X, Package, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../../Context/AppContext";

const NotificationSidebar = ({ isOpen, onClose }) => {
  const { token, baseURL } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchNotifications = async () => {
    if (!token || !baseURL) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/users/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        // Filter only order-related notifications
        const orderNotifications = (res.data.notifications || []).filter(
          (n) => n.type === "order" && n.orderId
        );
        setNotifications(orderNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      // Poll every 10 seconds when sidebar is open
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, token, baseURL]);

  const updateOrderStatus = async (userId, orderId, deliveryStatus) => {
    try {
      setUpdatingStatus(orderId);
      const res = await axios.put(
        `${baseURL}/api/users/orders/${userId}/${orderId}/status`,
        { deliveryStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Refresh notifications
        await fetchNotifications();
        // Also fetch all orders to get updated order details
        const ordersRes = await axios.get(`${baseURL}/api/users/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (ordersRes.data.success) {
          // Update notification with order details if available
          const updatedOrder = ordersRes.data.orders.find(
            (o) => o.orderId === orderId
          );
          if (updatedOrder) {
            setNotifications((prev) =>
              prev.map((n) =>
                n.orderId === orderId
                  ? {
                      ...n,
                      message: `Order #${orderId} status updated to: ${deliveryStatus}`,
                    }
                  : n
              )
            );
          }
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${baseURL}/api/users/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "Processing", label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: "Out for Delivery", label: "Out for Delivery", color: "bg-purple-100 text-purple-800" },
    { value: "Delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  ];

  // Group notifications by orderId and get order details
  const [orderDetails, setOrderDetails] = useState({});
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token || !baseURL || notifications.length === 0) return;
      
      try {
        const res = await axios.get(`${baseURL}/api/users/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.data.success) {
          const details = {};
          notifications.forEach((notif) => {
            if (notif.orderId) {
              const order = res.data.orders.find((o) => o.orderId === notif.orderId);
              if (order) {
                details[notif.orderId] = order;
              }
            }
          });
          setOrderDetails(details);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (isOpen && notifications.length > 0) {
      fetchOrderDetails();
    }
  }, [isOpen, notifications, token, baseURL]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-orange-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-slate-900">Order Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-slate-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>No order notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => {
                const order = orderDetails[notification.orderId];
                const isExpanded = expandedOrder === notification.orderId;

                return (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-slate-50 transition-colors ${
                      !notification.read ? "bg-orange-50/50" : ""
                    }`}
                  >
                    {/* Notification Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-orange-600" />
                          <h3 className="font-semibold text-slate-900 text-sm">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.createdAt)}
                          </span>
                          {notification.createdAt && (
                            <span>{formatDateTime(notification.createdAt)}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!notification.read) markAsRead(notification._id);
                          setExpandedOrder(
                            isExpanded ? null : notification.orderId
                          );
                        }}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Order Details & Actions */}
                    {isExpanded && order && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="space-y-3">
                          {/* Order Info */}
                          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Order ID:</span>
                              <span className="font-medium text-slate-900">
                                {order.orderId}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Customer:</span>
                              <span className="font-medium text-slate-900">
                                {order.customerName || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Amount:</span>
                              <span className="font-medium text-slate-900">
                                ₹{order.totalAmount || 0}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Current Status:</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  statusOptions.find(
                                    (s) => s.value === (order.deliveryStatus || order.orderStatus)
                                  )?.color || "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.deliveryStatus || order.orderStatus || "Pending"}
                              </span>
                            </div>
                          </div>

                          {/* Status Update Actions */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Update Delivery Status:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {statusOptions.map((status) => (
                                <button
                                  key={status.value}
                                  onClick={() => {
                                    // Find userId from notification or order
                                    const userId = order.customerId || notification.user?._id || notification.user;
                                    if (userId && order.orderId) {
                                      updateOrderStatus(userId, order.orderId, status.value);
                                    }
                                  }}
                                  disabled={
                                    updatingStatus === order.orderId ||
                                    (order.deliveryStatus || order.orderStatus) ===
                                      status.value
                                  }
                                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                    (order.deliveryStatus || order.orderStatus) ===
                                    status.value
                                      ? `${status.color} cursor-not-allowed`
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {updatingStatus === order.orderId ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mx-auto"></div>
                                  ) : (
                                    status.label
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;

