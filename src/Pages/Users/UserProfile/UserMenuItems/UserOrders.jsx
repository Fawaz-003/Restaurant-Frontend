import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../../Context/AppContext";
import { toast } from "react-toastify";
import {
  IndianRupee,
  Package,
  MapPin,
  Calendar,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const { axios, user } = useAppContext();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/orders/my-orders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError("Failed to fetch orders");
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Payment Failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Orders
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
  return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-indigo-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping!
            </p>
            <button
              onClick={() => navigate("/collections")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order._id);
            const firstItem = order.items[0];

            return (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-700">
                            Order Placed
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Order ID:</span>
                          <span className="text-xs font-mono text-gray-700">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div
                          className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white cursor-pointer hover:border-indigo-500 transition-colors"
                          onClick={() =>
                            navigate(`/products/${item.product?._id}`)
                          }
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={
                              item.product?.images?.[0]?.url ||
                              "https://via.placeholder.com/150"
                            }
                            alt={item.product?.name || "Product"}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-base font-semibold text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                            onClick={() =>
                              navigate(`/products/${item.product?._id}`)
                            }
                          >
                            {item.product?.name || "Product Name"}
                          </h3>
                          {item.product?.brand && (
                            <p className="text-sm text-gray-600 mb-2">
                              Brand: {item.product.brand}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-600">Size:</span>
                              <span className="text-xs font-semibold text-gray-900">
                                {item.size}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-600">Color:</span>
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color }}
                                title={item.color}
                              ></div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-600">Qty:</span>
                              <span className="text-xs font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Price:</span>
                            <span className="flex items-center gap-0.5 text-base font-bold text-gray-900">
                              <IndianRupee className="w-4 h-4" />
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Item Total</p>
                          <p className="flex items-center justify-end gap-0.5 text-lg font-bold text-indigo-600">
                            <IndianRupee className="w-4 h-4" />
                            {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Total Amount:{" "}
                          <span className="font-semibold text-gray-900">
                            <IndianRupee className="inline w-3 h-3" />
                            {order.totalAmount.toLocaleString()}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            View Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h4>
                          <div className="text-xs text-gray-700 space-y-1">
                            <p className="font-medium">
                              {order.shippingAddress.name ||
                                order.shippingAddress.fullName ||
                                "N/A"}
                            </p>
                            {order.shippingAddress.label && (
                              <p className="text-xs text-gray-500 italic">
                                ({order.shippingAddress.label})
                              </p>
                            )}
                            <p>
                              {order.shippingAddress.doorNo &&
                                `${order.shippingAddress.doorNo}, `}
                              {order.shippingAddress.street ||
                                order.shippingAddress.address ||
                                "N/A"}
                            </p>
                            {order.shippingAddress.city && (
                              <p>
                                {order.shippingAddress.city}
                                {order.shippingAddress.state &&
                                  `, ${order.shippingAddress.state}`}
                                {order.shippingAddress.country &&
                                  `, ${order.shippingAddress.country}`}
                              </p>
                            )}
                            {(order.shippingAddress.postalCode ||
                              order.shippingAddress.pincode) && (
                              <p>
                                PIN:{" "}
                                {order.shippingAddress.postalCode ||
                                  order.shippingAddress.pincode}
                              </p>
                            )}
                            {order.shippingAddress.phone && (
                              <p>Phone: {order.shippingAddress.phone}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment & Order Info */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Order Information
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-medium text-gray-900">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span
                              className={`font-semibold ${
                                order.paymentStatus === "Paid"
                                  ? "text-green-600"
                                  : order.paymentStatus === "Failed"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                          {order.paymentDetails?.razorpay_payment_id && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-gray-600 mb-1">Payment ID:</p>
                              <p className="font-mono text-xs text-gray-900 break-all">
                                {order.paymentDetails.razorpay_payment_id}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
