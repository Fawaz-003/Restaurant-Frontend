import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, X, ChevronRight, ListOrdered } from 'lucide-react';
import AddressSection from '../Components/Checkout/AddressSection';
import PaymentSection from '../Components/Checkout/PaymentSection';
import OrderSummary from '../Components/Checkout/OrderSummary';
import SuccessScreen from '../Components/Checkout/SuccessScreen';
import { useAppContext } from '../Context/AppContext';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { baseURL, token, userData } = useAppContext();
  const [step, setStep] = useState('address');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userClearedAddress, setUserClearedAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const cartKey = userData?._id ? `cart_${userData._id}` : "cart_guest";
  const ordersKey = userData?._id ? `orders_${userData._id}` : "orders_guest";

  const cartData = location.state || { cart: [] };
  const shopInfo = cartData.shopInfo || null;

  const initialCart = cartData.cart && cartData.cart.length
    ? cartData.cart
    : JSON.parse(localStorage.getItem(cartKey) || "[]");

  const [cartItems, setCartItems] = useState(initialCart || []);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);

  const handleBack = () => {
    if (step === 'payment') {
      setStep('address');
    } else {
      const referrer = document.referrer;
      const fromPath = location.state?.from;

      if (fromPath) {
        navigate(fromPath, {
          state: {
            cart: cartItems,
            preserveCart: true
          }
        });
      } else if (referrer && referrer.includes(window.location.origin)) {
        navigate(-1);
      } else {
        navigate('/', {
          state: {
            cart: cartItems,
            preserveCart: true
          }
        });
      }
    }
  };

  const handleSelectAddress = (address) => {
    // When user taps CHANGE, address becomes null and we return to selection step
    if (!address) {
      setStep("address");
      setUserClearedAddress(true);
    }
    if (address) {
      setUserClearedAddress(false);
    }
    setSelectedAddress(address);
  };
  const fetchAddresses = useCallback(async () => {
    if (!baseURL || !token) return;
    setAddressLoading(true);
    setAddressError(null);
    try {
      const response = await fetch(`${baseURL}/api/users/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load addresses");
      }
      const data = await response.json();
      const normalized = (data.addresses || []).map((addr, index) => ({
        id: addr.id || addr._id || index,
        label: addr.label || "Home",
        street: addr.line1 || addr.street || "",
        address: addr.address || addr.line2 || addr.fullAddress || "",
        phone: addr.phone || addr.mobile || "",
        deliveryTime: addr.deliveryTime || "45-60 MINS",
        raw: addr,
      }));
      setAddresses(normalized);
      if (normalized.length && !selectedAddress && !userClearedAddress) {
        const defaultAddr =
          normalized.find((a) => a.raw?.isDefault) || normalized[0];
        setSelectedAddress(defaultAddr);
      }
      return normalized;
    } catch (error) {
      setAddressError(error.message || "Unable to fetch addresses");
      setAddresses([]);
      setSelectedAddress(null);
      return [];
    } finally {
      setAddressLoading(false);
    }
  }, [baseURL, token, selectedAddress]);

  const handleAddNewAddress = async (newAddr) => {
    if (!baseURL || !token) return;
    try {
      const response = await fetch(`${baseURL}/api/users/addresses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newAddr.label,
          street: newAddr.street,
          address: newAddr.address,
          phone: newAddr.phone,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save address");
      }
      const updated = await fetchAddresses();
      if (updated?.length) {
        const latest = updated[updated.length - 1];
        setSelectedAddress(latest);
        setUserClearedAddress(false);
      }
    } catch (error) {
      setAddressError(error.message || "Unable to save address");
    }
  };

  const calculateTotals = () => {
    const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 35;
    const grandTotal = itemTotal + deliveryFee;

    return {
      itemTotal,
      deliveryFee,
      grandTotal
    };
  };

  const totals = calculateTotals();

  const updateQuantity = (itemId, delta) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === itemId || item._id === itemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity === 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };

  const handleProceedToPayment = () => {
    if (selectedAddress) {
      setStep('payment');
    }
  };

  const handleCompleteOrder = async (paymentResponse = null) => {
    setIsPaying(false);
    const orderPayload = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      total: totals.grandTotal,
      status: "Processing",
      date: new Date().toLocaleDateString(),
      address: selectedAddress?.address || "",
      deliveryTime: "Estimated soon",
      paymentMethod: selectedPayment || "online",
      paymentResponse,
      restaurant:
        shopInfo?.name ||
        shopInfo?.storeName ||
        shopInfo?.title ||
        "Restaurant",
      restaurantInfo: {
        id: shopInfo?.id || shopInfo?._id,
        name: shopInfo?.name || shopInfo?.storeName || shopInfo?.title,
        image: shopInfo?.image?.url || shopInfo?.image || "",
        address:
          shopInfo?.address ||
          shopInfo?.location?.address ||
          shopInfo?.location?.title ||
          "",
      },
    };
    try {
      if (token) {
        await axios.post(
          `${baseURL}/api/users/orders`,
          {
            orderId: orderPayload.id,
            shopId: orderPayload.restaurantInfo.id,
            items: orderPayload.items,
            totalAmount: orderPayload.total,
            paymentStatus: selectedPayment === "online" ? "Paid" : "Pending",
            orderStatus: "Placed",
            deliveryAddress: orderPayload.address,
            restaurantInfo: orderPayload.restaurantInfo,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Failed to store order in backend", error);
    }
    // clear cart after placing order
    localStorage.removeItem(cartKey);
    setCartItems([]);
    setStep("success");
  };


  const handleReset = () => {
    setStep('address');
    setSelectedAddress(null);
    setSelectedPayment(null);
    setUpiId('');
  };

  useEffect(() => {
    setShowOrderSummary(false);
  }, [step]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Payment helpers
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const startOnlinePayment = async () => {
    setIsPaying(true);
    try {
      const isScriptLoaded = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!isScriptLoaded) {
        alert("Razorpay failed to load.");
        setIsPaying(false);
        return;
      }

      const { data } = await axios.post(
        `${baseURL}/api/payment/create-order`,
        { amount: totals.grandTotal }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Your Restaurant",
        description: "Food Order",
        order_id: data.orderId,

        handler: async function (response) {
          const verificationRes = await axios.post(
            `${baseURL}/api/payment/verify-payment`,
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }
          );

          if (verificationRes.data.success) {
            handleCompleteOrder(response);
          }
        },

        modal: {
          ondismiss: function () {
            setIsPaying(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.log(error);
      setIsPaying(false);
    } finally {
      // In case handler doesn't run due to errors
      if (isPaying) {
        setIsPaying(false);
      }
    }
  };

  const handlePrimaryAction = async () => {
    if (step === 'address') {
      handleProceedToPayment();
      return;
    }
    if (!selectedPayment) return;
    if (selectedPayment === 'online') {
      await startOnlinePayment();
      return;
    }
    await handleCompleteOrder();
  };

  if (step === 'success') {
    return (
      <SuccessScreen
        selectedAddress={selectedAddress}
        totals={totals}
        selectedPayment={selectedPayment}
        onReset={handleReset}
        cartItems={cartItems}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          {!selectedAddress && !showOrderSummary && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
          )}

          {selectedAddress && !showOrderSummary && <div></div>}

          {!showOrderSummary && (
            <button
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="flex items-center gap-1.5 text-green-600 font-semibold text-sm bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors ml-auto"
            >
              <ListOrdered className="w-4 h-4" />
              <span>Summary</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showOrderSummary ? 'rotate-90' : 'rotate-0'}`} />
            </button>
          )}

          {showOrderSummary && (
            <div className="w-full flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
              <button
                onClick={() => setShowOrderSummary(false)}
                className="text-gray-500 hover:text-gray-800 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden  py-4 lg:block bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between relative">
            <div className="flex-1">
              {!selectedAddress && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 'address' ? 'bg-green-500 text-white' : step === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <span className={`text-sm font-medium ${step === 'address' ? 'text-green-600' : step === 'payment' ? 'text-green-600' : 'text-gray-600'}`}>
                  Delivery Address
                </span>
              </div>
              <div className={`h-[2px] w-12 ${step === 'payment' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <span className={`text-sm font-medium ${step === 'payment' ? 'text-green-600' : 'text-gray-600'}`}>
                  Payment
                </span>
              </div>
            </div>

            <div className="flex-1"></div>
          </div>
        </div>
      </div>

      <div className="pt-16 lg:pt-4 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="lg:hidden py-3 mb-2">
            <div className="bg-white rounded-lg shadow-sm p-3 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step === 'address' ? 'bg-green-500 text-white' : step === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className={`h-[2px] w-8 ${step === 'payment' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8">
            <div className={`${showOrderSummary ? 'hidden lg:block lg:col-span-2' : 'block lg:col-span-2'} max-w-4xl mx-auto lg:mx-0 w-full`}>
              {step === 'address' ? (
                <AddressSection
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  onSelectAddress={handleSelectAddress}
                  onAddNewAddress={handleAddNewAddress}
                  loading={addressLoading}
                  error={addressError}
                />
              ) : (
                <PaymentSection
                  selectedPayment={selectedPayment}
                  onSelectPayment={setSelectedPayment}
                />


              )}
            </div>

            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary
                  cartItems={cartItems}
                  onUpdateQuantity={updateQuantity}
                  totals={totals}
                  step={step}
                  selectedAddress={selectedAddress}
                  selectedPayment={selectedPayment}
                  upiId={upiId}
                  onProceedToPayment={handleProceedToPayment}
                  onPrimaryAction={handlePrimaryAction}
                  isPaying={isPaying}
                />
              </div>
            </div>

            <div className={`lg:hidden fixed inset-0 z-40 transition-transform duration-300 ease-out ${showOrderSummary ? 'translate-x-0' : 'translate-x-full'}`}>
              <div
                className="absolute inset-0 bg-black/50 lg:hidden"
                onClick={() => setShowOrderSummary(false)}
              />

              <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto pt-16 pb-24">
                  <OrderSummary
                    cartItems={cartItems}
                    onUpdateQuantity={updateQuantity}
                    totals={totals}
                    step={step}
                    selectedAddress={selectedAddress}
                    selectedPayment={selectedPayment}
                    upiId={upiId}
                    onProceedToPayment={() => {
                      setShowOrderSummary(false);
                      handleProceedToPayment();
                    }}
                    onPrimaryAction={() => {
                      setShowOrderSummary(false);
                      handlePrimaryAction();
                    }}
                    isPaying={isPaying}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-600">Total Amount</div>
              <div className="font-bold text-lg text-gray-900">₹{totals.grandTotal.toLocaleString()}</div>
            </div>
            <button
              onClick={handlePrimaryAction}
              disabled={
                (step === 'address' && !selectedAddress) ||
                (step === 'payment' && (!selectedPayment || (selectedPayment === 'upi' && !upiId) || isPaying)) ||
                cartItems.length === 0
              }
              className={`px-5 py-2.5 rounded-lg font-semibold text-white text-sm ${(step === 'address' && !selectedAddress) ||
                (step === 'payment' && (!selectedPayment || (selectedPayment === 'upi' && !upiId) || isPaying)) ||
                cartItems.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {step === 'address'
                ? (selectedAddress ? 'Proceed to Payment' : 'Select Address')
                : (selectedPayment
                  ? (selectedPayment === 'online' ? (isPaying ? 'Processing...' : 'Pay & Place Order') : 'Place Order')
                  : 'Select Payment')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;