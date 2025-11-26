import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessScreen = ({ selectedAddress, totals, selectedPayment, onReset }) => {
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'upi': return 'UPI Payment';
      case 'card': return 'Credit/Debit Card';
      case 'cod': return 'Cash on Delivery';
      default: return 'Payment';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">Your food will be delivered in 38 mins</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Order Total</span>
            <span className="font-semibold">₹{totals.grandTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-semibold capitalize">
              {getPaymentMethodText(selectedPayment)}
            </span>
          </div>
        </div>
        <Link to ="/"
          onClick={onReset}
          className="w-full bg-green-600 text-white py-3 px-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessScreen;