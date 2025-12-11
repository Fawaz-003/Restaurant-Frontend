import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, X, ChevronRight, ListOrdered } from 'lucide-react';
import AddressSection from '../Components/Checkout/AddressSection';
import PaymentSection from '../Components/Checkout/PaymentSection';
import OrderSummary from '../Components/Checkout/OrderSummary';
import SuccessScreen from '../Components/Checkout/SuccessScreen';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState('address');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const cartData = location.state || {
    cart: [
      {
        id: 1,
        name: 'Fruit Salad With Strawberry Icecream',
        price: 280,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=150&h=150&fit=crop&crop=center'
      },
      {
        id: 2,
        name: 'Grilled Chicken Sandwich',
        price: 180,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop&crop=center'
      }
    ]
  };

  const [cartItems, setCartItems] = useState(cartData.cart || cartData);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      street: 'Mosque Street',
      address: '17/2, Mosque Street, Pallikonda, New Mohalla, Tamil Nadu 635809, India',
      phone: '9876543210',
      deliveryTime: '54 MINS',
    }
  ]);

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
    setSelectedAddress(address);
  };
  const handleAddNewAddress = (newAddr) => {
    const newId = addresses.length + 1;
    const addressWithId = { ...newAddr, id: newId };
    setAddresses(prev => [...prev, addressWithId]);
    setSelectedAddress(addressWithId);
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

  const handleCompleteOrder = (paymentResponse = null) => {
    console.log("Razorpay Response:", paymentResponse);

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
                />
              ) : (
                <PaymentSection
                  selectedPayment={selectedPayment}
                  onSelectPayment={setSelectedPayment}
                  cartTotal={totals.grandTotal}
                  onContinue={handleCompleteOrder}
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
                  onCompleteOrder={handleCompleteOrder}
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
                    onCompleteOrder={() => {
                      setShowOrderSummary(false);
                      handleCompleteOrder();
                    }}
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
              onClick={step === 'address' ? handleProceedToPayment : handleCompleteOrder}
              disabled={
                (step === 'address' && !selectedAddress) ||
                (step === 'payment' && (!selectedPayment || (selectedPayment === 'upi' && !upiId))) ||
                cartItems.length === 0
              }
              className={`px-5 py-2.5 rounded-lg font-semibold text-white text-sm ${(step === 'address' && !selectedAddress) ||
                (step === 'payment' && (!selectedPayment || (selectedPayment === 'upi' && !upiId))) ||
                cartItems.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {step === 'address'
                ? (selectedAddress ? 'Proceed to Payment' : 'Select Address')
                : (selectedPayment ? 'Place Order' : 'Select Payment')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;