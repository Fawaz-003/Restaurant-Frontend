import React from 'react';
import { ArrowLeft, CreditCard, Wallet, Banknote } from 'lucide-react';

const PaymentSection = ({ 
  selectedPayment, 
  onSelectPayment, 
  upiId, 
  onUpiIdChange, 
  onBack 
}) => {
  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <Wallet className="w-5 h-5" />, desc: 'Pay by any UPI app' },
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5" />, desc: 'Secure card payment' },
    { id: 'cod', name: 'Cash on Delivery', icon: <Banknote className="w-5 h-5" />, desc: 'Pay when you receive' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
            <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      <div className="flex items-center gap-4 mb-6 mt-6">
        <div className="flex items-center gap-3">
     
          <div>
            <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
            <p className="text-sm text-gray-500">Choose how you'd like to pay</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id}>
            <div
              onClick={() => onSelectPayment(method.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                selectedPayment === method.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  selectedPayment === method.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.desc}</p>
                </div>
                {selectedPayment === method.id && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedPayment === method.id && method.id === 'upi' && (
              <div className="mt-3 ml-14">
                <input
                  type="text"
                  placeholder="Enter your UPI ID (e.g., yourname@upi)"
                  value={upiId}
                  onChange={(e) => onUpiIdChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSection;