import React from 'react';

const OrderSummary = ({ 
  cartItems, 
  onUpdateQuantity, 
  totals, 
  step, 
  selectedAddress, 
  selectedPayment, 
  upiId, 
  onProceedToPayment, 
  onCompleteOrder 
}) => {
  const getButtonText = () => {
    if (step === 'address') {
      return selectedAddress ? 'Proceed to Payment' : 'Select Delivery Address';
    } else {
      if (!selectedPayment) return 'Select Payment Method';
      if (selectedPayment === 'upi' && !upiId) return 'Enter UPI ID';
      return 'Complete Order';
    }
  };

  const isButtonDisabled = () => {
    if (step === 'address') {
      return !selectedAddress;
    } else {
      return !selectedPayment || (selectedPayment === 'upi' && !upiId);
    }
  };

  // Totals calculation without free delivery logic
  const calculateItemTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const DELIVERY_FEE = 39; // Fixed delivery fee

  const calculateGrandTotal = () => calculateItemTotal() + DELIVERY_FEE;

  const finalTotals = totals || {
    itemTotal: calculateItemTotal(),
    deliveryFee: DELIVERY_FEE,
    grandTotal: calculateGrandTotal()
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
      {/* Main Heading */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">Order Summary</h3>

      {/* Subheading before cart items */}
      <h4 className="text-md font-semibold text-gray-700 mb-3">Your Items</h4>

      <div className="space-y-4 mb-6 max-h-56 overflow-y-auto">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id || item._id} className="flex gap-3">
              <img
                src={item.image || item.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&crop=center'}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{item.name}</h4>

                {/* Item Customizations */}
                {item.customizations && item.customizations.length > 0 && (
                  <div className="mb-2">
                    {item.customizations.map((custom, index) => (
                      <p key={index} className="text-xs text-gray-500">• {custom}</p>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id || item._id, -1)}
                      className="text-gray-600 hover:text-gray-800 w-6 h-6 flex items-center justify-center font-bold transition hover:bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id || item._id, 1)}
                      className="text-gray-600 hover:text-gray-800 w-6 h-6 flex items-center justify-center font-bold transition hover:bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No items in cart</div>
        )}
      </div>

      {/* Bill Details */}
      <div className="border-t pt-4 space-y-3 mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">Bill Details</h4>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Item Total</span>
          <span className="font-medium">₹{finalTotals.itemTotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">₹{finalTotals.deliveryFee}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <div>
            <span className="font-semibold text-gray-900 text-lg">TO PAY</span>
            <p className="text-xs text-gray-500">Total amount</p>
          </div>
          <span className="font-bold text-gray-900 text-xl">₹{finalTotals.grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={step === 'address' ? onProceedToPayment : onCompleteOrder}
        disabled={isButtonDisabled() || !cartItems || cartItems.length === 0}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
          isButtonDisabled() || !cartItems || cartItems.length === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {!cartItems || cartItems.length === 0 ? 'Cart is Empty' : getButtonText()}
      </button>
    </div>
  );
};

export default OrderSummary;
