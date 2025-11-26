import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddressSection from '../Components/Checkout/AddressSection';
import PaymentSection from '../Components/Checkout/PaymentSection';
import OrderSummary from '../Components/Checkout/OrderSummary';
import SuccessScreen from '../Components/Checkout/SuccessScreen';

const Checkout = () => {
  const location = useLocation();
  const [step, setStep] = useState('address');
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [upiId, setUpiId] = useState('');
  
  // Get cart data from navigation state or use default
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
    ],
    totalItems: 3,
    totalPrice: 740,
    finalAmount: 777
  };

  const [cartItems, setCartItems] = useState(cartData.cart || cartData);
  const [addresses, setAddresses] = useState([
    // {
    //   id: 1,
    //   label: 'Home',
    //   address: '17/2, Mosque Street, Pallikonda, New Mohalla, Tamil Nadu 635809, India',
    //   deliveryTime: '38 mins'
    // }
  ]);

  // Calculate totals based on cart data
  const calculateTotals = () => {
    const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = itemTotal > 299 ? 0 : 39;
    const gst = Math.round(itemTotal * 0.05);
    const grandTotal = itemTotal + deliveryFee + gst;

    return {
      itemTotal,
      deliveryFee,
      gst,
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

  const handleAddNewAddress = (newAddr) => {
    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddress(newAddr.id);
  };

  const handleProceedToPayment = () => {
    if (selectedAddress) {
      setStep('payment');
    }
  };

  const handleCompleteOrder = () => {
    if (selectedPayment && (selectedPayment !== 'upi' || upiId)) {
      setStep('success');
    }
  };

  const handleReset = () => {
    setStep('address');
    setSelectedAddress(1);
    setSelectedPayment(null);
    setUpiId('');
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
      

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === 'address' ? (
              <AddressSection
                addresses={addresses}
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
                onAddNewAddress={handleAddNewAddress}
              />
            ) : (
              <PaymentSection
                selectedPayment={selectedPayment}
                onSelectPayment={setSelectedPayment}
                upiId={upiId}
                onUpiIdChange={setUpiId}
                onBack={() => setStep('address')}
              />
            )}
          </div>

          <div className="lg:col-span-1">
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
      </div>
    </div>
  );
};

export default Checkout;