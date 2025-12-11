import React, { useState } from "react";
import { Package, CheckCircle, Clock, MapPin, ChevronRight, Calendar, Image } from "lucide-react";

const Orders = () => {
  const [orders] = useState([
    {
      id: "ORD001",
      items: [
        { name: "Paneer Butter Masala", quantity: 1, price: 220, image: "/food1.jpg" },
        { name: "Garlic Naan", quantity: 2, price: 40, image: "/food2.jpg" },
        { name: "Mango Lassi", quantity: 1, price: 80, image: "/food3.jpg" }
      ],
      total: 380,
      status: "Delivered",
      date: "10 Dec 2025",
      address: "123 Main Street, Apartment 4B, New Delhi 110001",
      deliveryTime: "8:00 PM",
      restaurant: "Royal Indian Kitchen",
      rating: 4.5
    },
    {
      id: "ORD002",
      items: [
        { name: "Chicken Shawarma", quantity: 1, price: 150, image: "/food4.jpg" },
        { name: "French Fries", quantity: 1, price: 80, image: "/food5.jpg" }
      ],
      total: 230,
      status: "Processing",
      date: "11 Dec 2025",
      address: "456 Park Avenue, Mumbai 400001",
      deliveryTime: "Estimated: 7:30 PM",
      restaurant: "Middle Eastern Delight",
      rating: 4.2
    },
    {
      id: "ORD003",
      items: [
        { name: "Veg Biryani", quantity: 1, price: 180, image: "/food6.jpg" },
        { name: "Raita", quantity: 1, price: 40, image: "/food7.jpg" },
        { name: "Gulab Jamun", quantity: 2, price: 60, image: "/food8.jpg" }
      ],
      total: 280,
      status: "Delivered",
      date: "09 Dec 2025",
      address: "789 Ocean Drive, Goa 403001",
      deliveryTime: "6:45 PM",
      restaurant: "Spice Garden",
      rating: 4.7
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "bg-green-100 text-green-800",
      Processing: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
      Shipped: "bg-purple-100 text-purple-800",
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage all your orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
              <button className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition">
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-semibold text-gray-900">Order #{order.id}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {order.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {order.deliveryTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{order.total}</p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Items Ordered</h3>
                    <span className="text-sm text-gray-600">{order.items.length} items</span>
                  </div>
                  
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        {/* Item Image */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-rose-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🍛</span>
                          </div>
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">₹{item.price} each</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm font-medium text-gray-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition">
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <h4 className="font-medium text-gray-900">Delivery Address</h4>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {order.address}
                      </p>
                    </div>

                    {/* Restaurant Info */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Restaurant Details</h4>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🏪</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.restaurant}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-amber-400">
                                  {i < Math.floor(order.rating) ? '★' : '☆'}
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{order.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                      Download Invoice
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition">
                      Rate Order
                    </button>
                    <button className="px-5 py-2.5 border border-orange-600 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition">
                      Order Again
                    </button>
                    <button className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition ml-auto">
                      Help
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;