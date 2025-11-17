import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../Context/AppContext.jsx";
import { toast } from "react-toastify";
import { 
  IndianRupee, 
  Package, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Calendar,
  User,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Truck
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const { axios } = useAppContext();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/orders/all-orders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError("Failed to fetch orders");
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/api/orders/status/${orderId}`, { status: newStatus });
      if (res.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(o =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o
          )
        );
        toast.success("Order status updated!");
      } else {
        toast.error(res.data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage = error.response?.data?.message || "Failed to update status.";
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Payment Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-100 rounded-full p-4 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
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
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-indigo-100 rounded-full p-4 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-12 h-12 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600">
              Orders will appear here once customers place them.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Manage Orders
            </h1>
            <p className="text-sm text-gray-600">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order._id);
            const firstItem = order.items[0];
            
            return (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow transition-shadow"
              >
                {/* Compact Order Card - Always Visible */}
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Left: Product Image & Name */}
                    <div className="flex gap-3 flex-1 min-w-0">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            firstItem?.product?.images?.[0]?.url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={firstItem?.product?.name || "Product"}
                        />
                      </div>

                      {/* Product Name & Basic Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                          {firstItem?.product?.name || "Product Name"}
                        </h3>
                        {order.items.length > 1 && (
                          <p className="text-xs text-gray-600 mb-1">
                            +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          <span className="truncate">
                            {order.customerName || order.user?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Order ID & Date */}
                    <div className="flex flex-col justify-center gap-1.5 sm:w-40">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
                        <p className="text-xs font-mono font-semibold text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Right: Amount & Status */}
                    <div className="flex flex-col justify-center gap-2 sm:w-36">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                        <p className="flex items-center gap-1 text-base font-bold text-indigo-600">
                          <IndianRupee className="w-4 h-4" />
                          {order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "Failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Show More Details Button */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          Show Less Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          Show More Details
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details - Only shown when expanded (without priority details) */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Left Section - Products */}
                      <div className="lg:col-span-8">
                        <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Order Items ({order.items.length})
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200"
                            >
                              {/* Product Image */}
                              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
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
                              <div className="flex-1">
                                <h5 className="font-semibold text-sm text-gray-900 mb-1">
                                  {item.product?.name || "Product Name"}
                                </h5>
                                {item.product?.brand && (
                                  <p className="text-xs text-gray-600 mb-1">
                                    Brand: {item.product.brand}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-3 mt-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-gray-600">Size:</span>
                                    <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                                      {item.size}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-gray-600">Color:</span>
                                    <div className="flex items-center gap-1.5">
                                      <div
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: item.color }}
                                        title={item.color}
                                      ></div>
                                      <span className="text-xs text-gray-500 capitalize">
                                        {item.color}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-gray-600">Qty:</span>
                                    <span className="font-semibold text-xs text-gray-900">
                                      {item.quantity}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-600">Price:</span>
                                    <span className="flex items-center gap-0.5 text-xs text-green-600 font-semibold">
                                      <IndianRupee className="w-3 h-3" />
                                      {item.price}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-1.5 pt-1.5 border-t border-gray-200">
                                  <span className="text-xs text-gray-600">Item Total: </span>
                                  <span className="flex items-center gap-0.5 text-sm font-bold text-gray-900">
                                    <IndianRupee className="w-3 h-3" />
                                    {(item.price * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Section - Additional Details Only */}
                      <div className="lg:col-span-4">
                        <div className="space-y-3">
                          {/* Shipping Address */}
                          {order.shippingAddress && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Shipping Address
                              </h4>
                              <div className="text-xs text-gray-700 space-y-1">
                                <p className="font-medium">
                                  {order.shippingAddress.name || order.shippingAddress.fullName || "N/A"}
                                </p>
                                {order.shippingAddress.label && (
                                  <p className="text-xs text-gray-500 italic">
                                    ({order.shippingAddress.label})
                                  </p>
                                )}
                                <p>
                                  {order.shippingAddress.doorNo && `${order.shippingAddress.doorNo}, `}
                                  {order.shippingAddress.street || order.shippingAddress.address || "N/A"}
                                </p>
                                {order.shippingAddress.city && (
                                  <p>
                                    {order.shippingAddress.city}
                                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                                    {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
                                  </p>
                                )}
                                {(order.shippingAddress.postalCode || order.shippingAddress.pincode) && (
                                  <p>PIN: {order.shippingAddress.postalCode || order.shippingAddress.pincode}</p>
                                )}
                                {order.shippingAddress.phone && (
                                  <p>Phone: {order.shippingAddress.phone}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Payment Details */}
                          {order.paymentDetails && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Details
                              </h4>
                              <div className="space-y-1.5 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                  <span className="text-gray-600">Payment Verified</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Payment ID: </span>
                                  <span className="font-mono text-xs text-gray-900 break-all">
                                    {order.paymentDetails.razorpay_payment_id}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Order ID: </span>
                                  <span className="font-mono text-xs text-gray-900 break-all">
                                    {order.paymentDetails.razorpay_order_id}
                                  </span>
                                </div>
                                <div className="pt-1.5 border-t border-gray-200">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span>Signature verified</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Admin: Update Status */}
                          {order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled" && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                Update Order Status
                              </h4>
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Payment Failed">Payment Failed</option>
                              </select>
                              <p className="text-xs text-gray-500 mt-2">
                                The customer will be notified of the status change.
                              </p>
                            </div>
                          )}

                          {/* Order Summary */}
                          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                            <h4 className="text-base font-semibold text-gray-900 mb-2">
                              Order Summary
                            </h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Items ({order.items.length})
                                </span>
                                <span className="font-medium text-gray-900">
                                  {order.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                  )}{" "}
                                  items
                                </span>
                              </div>
                              <div className="pt-1.5 border-t border-indigo-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-bold text-gray-900">
                                    Total Amount
                                  </span>
                                  <span className="flex items-center gap-0.5 text-base font-bold text-indigo-600">
                                    <IndianRupee className="w-4 h-4" />
                                    {order.totalAmount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
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

export default AdminOrders;