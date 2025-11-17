import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  CreditCard,
  Wallet,
  Plus,
  Minus,
} from "lucide-react";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartItemCount,
} from "../utils/cartUtils";
import CartSkeleton from "../Layout/Skeleton/CartSkeleton";
import { useAppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import OpenModel from "../Components/OpenModel";

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true); // New state for skeleton display
  const navigate = useNavigate();
  const { axios, user } = useAppContext();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    btnMessage: "",
    onConfirm: () => {},
  });

  const loadCart = useCallback(async () => {
    setLoading(true);
    setShowSkeleton(true); // Always show skeleton when loading starts
    const startTime = Date.now(); // Record start time

    try {
      const cart = await getCart(axios);
      setCartItems(cart);
      setCartCount(getCartItemCount(cart));
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load cart");
    } finally {
      const elapsedTime = Date.now() - startTime;
      const minDisplayTime = 700; // 0.7 seconds

      if (elapsedTime < minDisplayTime) {
        setTimeout(() => {
          setLoading(false);
          setShowSkeleton(false);
        }, minDisplayTime - elapsedTime);
      } else {
        setLoading(false);
        setShowSkeleton(false);
      }
    }
  }, [axios]); // Dependency array for useCallback

  // Load cart items on component mount and when cart updates
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = async (item, newQuantity) => {
    const result = await updateCartQuantity(
      axios,
      item.product._id,
      item.size,
      item.color,
      newQuantity
    );

    if (result.success) {
      // If the user is not logged in, the result.cart is the full cart.
      // If logged in, it might be the full cart or just a success message.
      // We should reload the cart to be safe and consistent.
      if (user) {
        setCartItems(result.cart);
      } else {
        loadCart();
      }
      setCartCount(getCartItemCount(result.cart));
    } else {
      toast.error(result.message || "Failed to update quantity");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: "",
      message: "",
      btnMessage: "",
      onConfirm: () => {},
    });
  };

  const handleRemoveItem = (item) => {
    setModalState({
      isOpen: true,
      title: "Remove Item From Cart",
      message: `Are you sure you want to remove "${item.product?.name}" from your cart?`,
      btnMessage: "Remove",
      onConfirm: async () => {
        const result = await removeFromCart(
          axios,
          item.product._id,
          item.size,
          item.color
        );
        if (result.success) {
          loadCart();
          toast.success("Item removed from cart");
        } else {
          toast.error("Failed to remove item");
        }
        closeModal();
      },
    });
  };

  const handleClearCart = () => {
    setModalState({
      isOpen: true,
      title: "Clear Entire Cart",
      message:
        "Are you sure you want to clear your entire cart? This action cannot be undone.",
      btnMessage: "Clear Cart",
      onConfirm: async () => {
        const result = await clearCart(axios);
        if (result.success) {
          loadCart();
          toast.success("Cart cleared");
        } else {
          toast.error("Failed to clear cart");
        }
        closeModal();
      },
    });
  };

  const calculateSubtotal = () => {
    return getCartTotal(cartItems);
  };

  const calculatePlatformFee = () => {
    return 20;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.01; // 1% tax
  };

  const calculateShipping = () => {
    return 0; // Free shipping for now
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping() + calculatePlatformFee();
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [loadCart]);

  if (loading || showSkeleton) {
    // Display skeleton if loading or if min display time hasn't passed
    return <CartSkeleton />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[70vh] bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="bg-indigo-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <OpenModel
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        {...modalState}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Items in Cart
                </h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div
                        className="w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-indigo-500 transition-colors flex-shrink-0 bg-white"
                        onClick={() =>
                          navigate(`/products/${item.product._id}`)
                        }
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={
                            item.product?.images?.[0]?.url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.product?.name}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3
                            className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() =>
                              navigate(`/products/${item.product._id}`)
                            }
                          >
                            {item.product?.name}
                          </h3>

                          {/* Variant Details */}
                          <div className="flex flex-wrap gap-4 mb-4">
                            {/* Size */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 font-medium">
                                Size:
                              </span>
                              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-semibold">
                                {item.size}
                              </span>
                            </div>

                            {/* Color */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 font-medium">
                                Color:
                              </span>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                                  style={{ backgroundColor: item.color }}
                                  title={item.color}
                                ></div>
                                <span className="text-xs text-gray-500 capitalize">
                                  {item.color}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600 font-medium">
                                Price:
                              </span>
                              <span className="flex items-center gap-1 text-green-600 font-semibold">
                                <IndianRupee className="w-4 h-4" />
                                {item.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 font-medium">
                              Quantity:
                            </span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-1 border-x border-gray-300 font-semibold min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity + 1)
                                }
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Item Total and Remove */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Item Total
                              </p>
                              <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" />
                                {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping Button */}
            <button
              className="mt-6 flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors group"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Price ({cartCount} items)
                    </span>
                    <span className="flex items-center gap-1 font-medium text-gray-900">
                      <IndianRupee className="w-4 h-4" />
                      {calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="text-green-600 font-medium">
                      {calculateShipping() === 0
                        ? "Free"
                        : `₹${calculateShipping()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="flex items-center gap-1 font-medium text-gray-900">
                      <IndianRupee className="w-4 h-4" />
                      {calculatePlatformFee().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (1%)</span>
                    <span className="flex items-center gap-1 font-medium text-gray-900">
                      <IndianRupee className="w-4 h-4" />
                      {calculateTax().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-200 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="flex items-center gap-1 text-xl font-bold text-indigo-600">
                      <IndianRupee className="w-5 h-5" />
                      {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order / Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-indigo-600 hover:bg-indigo-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
