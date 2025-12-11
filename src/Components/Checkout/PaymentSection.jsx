import React, { useState } from 'react';
import axios from 'axios';

const PaymentSection = ({ selectedPayment, onSelectPayment, cartTotal, onContinue }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    setIsProcessing(true);

    try {
      const isScriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isScriptLoaded) {
        alert('Razorpay failed to load.');
        setIsProcessing(false);
        return;
      }

      const { data } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: cartTotal
      });

      const options = {
        key :import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Your Restaurant',
        description: 'Food Order',
        order_id: data.orderId,

        handler: async function (response) {
          const verificationRes = await axios.post('http://localhost:5000/api/payment/verify-payment', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verificationRes.data.success) {
            // alert('Payment Successful!');
            onContinue();
          } else {
            // alert('Payment verification failed');
          }
        },

        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">

      <h3 className="text-xl font-semibold mb-6">Payment Options</h3>

      <label
        className={`flex items-center p-4 border rounded-lg cursor-pointer 
          ${selectedPayment === 'online'
            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
            : 'border-gray-300 hover:border-gray-400'
          }`}
        onClick={() => {
          onSelectPayment('online');
          handleOnlinePayment();
        }}
      >
        <input
          type="radio"
          checked={selectedPayment === 'online'}
          readOnly
          className="w-4 h-4 text-indigo-600"
        />
        <span className="ml-3">
          {isProcessing ? 'Processing...' : 'Pay Online (UPI / Card / NetBanking)'}
        </span>
      </label>

      {/* COD */}
      <label
        className={`flex items-center p-4 border rounded-lg cursor-pointer mt-3 
          ${selectedPayment === 'cod'
            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
            : 'border-gray-300 hover:border-gray-400'
          }`}
        onClick={() => onSelectPayment('cod')}
      >
        <input
          type="radio"
          checked={selectedPayment === 'cod'}
          readOnly
          className="w-4 h-4 text-indigo-600"
        />
        <span className="ml-3">Cash on Delivery</span>
      </label>

    </div>
  );
};

export default PaymentSection;
