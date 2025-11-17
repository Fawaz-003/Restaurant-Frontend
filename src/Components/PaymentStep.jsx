import React from 'react';

const PaymentStep = ({ formData, handleInputChange, onContinue }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Options</h3>
      
      <div className="space-y-3">
        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
          formData.paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'
        }`} onClick={() => handleInputChange({ target: { name: 'paymentMethod', value: 'online' } })}>
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            checked={formData.paymentMethod === 'online'}
            readOnly
            className="w-4 h-4 text-indigo-600"
          />
          <span className="ml-3 text-gray-900 font-medium">Online Payments</span>
        </label>

        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
          formData.paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'
        }`} onClick={() => handleInputChange({ target: { name: 'paymentMethod', value: 'cod' } })}>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            readOnly
            className="w-4 h-4 text-indigo-600"
          />
          <span className="ml-3 text-gray-900 font-medium">Cash on Delivery (COD)</span>
        </label>
      </div>
    </div>
  );
};

export default PaymentStep;