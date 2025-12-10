import React from 'react';
import { ArrowLeft, CreditCard, Wallet, Smartphone, Landmark } from 'lucide-react';

const PaymentSection = ({
  selectedPayment,
  onSelectPayment,
  upiId,
  onUpiIdChange,
  onBack
}) => {

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'upi', label: 'UPI', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'netbanking', label: 'Net Banking', icon: <Landmark className="w-5 h-5" /> },
  ];

  return (
    <div className="p-4 sm:p-6">
      
      {/* Header with Back Button - Mobile Only */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg sm:text-2xl font-bold">Select Payment Method</h2>
      </div>
      
      {/* Desktop Header with Back Button */}
      <div className="hidden lg:block mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              {/* <span>Back</span> */}
            </button>
          )}
          <h2 className="text-xl sm:text-xl font-bold">Select Payment Method</h2>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onSelectPayment(method.id)}
            className={`p-4 border-2 rounded-xl text-sm sm:text-lg cursor-pointer transition-all ${
              selectedPayment === method.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  selectedPayment === method.id ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                {method.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{method.label}</h3>
                <p className="text-sm text-gray-500">
                  {method.id === 'card' && 'Pay with your card'}
                  {method.id === 'upi' && 'Pay using any UPI app'}
                  {method.id === 'wallet' && 'Pay using wallet balance'}
                  {method.id === 'netbanking' && 'Pay via net banking'}
                </p>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedPayment === method.id
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedPayment === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                )}
              </div>
            </div>

            {/* UPI input */}
            {method.id === 'upi' && selectedPayment === 'upi' && (
              <div className="mt-4 pl-14">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => onUpiIdChange(e.target.value)}
                  placeholder="Enter your UPI ID (e.g., name@upi)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  You'll be redirected to your UPI app to complete the payment
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Secure Payment:</span> Your payment details are encrypted and secure.
          We don't store your card information.
        </p>
      </div>

    </div>
  );
};

export default PaymentSection;
