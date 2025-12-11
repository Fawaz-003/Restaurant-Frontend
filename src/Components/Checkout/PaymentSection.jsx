import React, { useState } from "react";
import axios from "axios";
import { Smartphone, CircleDollarSign } from "lucide-react";

const PaymentSection = ({ selectedPayment, onSelectPayment, cartTotal, onContinue }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    setIsProcessing(true);

    try {
      const isScriptLoaded = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!isScriptLoaded) {
        alert("Razorpay failed to load.");
        setIsProcessing(false);
        return;
      }

      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: cartTotal }
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
            "http://localhost:5000/api/payment/verify-payment",
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }
          );

          if (verificationRes.data.success) {
            onContinue();
          }
        },

        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Select Payment Method
      </h3>

      {/* ONLINE PAYMENT */}
      <div
        className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 
        border group
        ${selectedPayment === "online"
          ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-xl scale-[1.02]"
          : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/20"
        }`}
        onClick={() => {
          onSelectPayment("online");
          handleOnlinePayment();
        }}
      >
        <div
          className={`p-3 rounded-xl transition
          ${selectedPayment === "online" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"}
        `}
        >
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            Pay Online (UPI / Card / NetBanking)
          </span>
          <span className="text-sm text-gray-500">Secure • Fast • Recommended</span>
        </div>

        {/* Loader */}
        {isProcessing && (
          <div className="ml-auto animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
        )}
      </div>

      {/* CASH ON DELIVERY */}
      <div
        className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 mt-4
        border
        ${selectedPayment === "cod"
          ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-xl scale-[1.02]"
          : "border-gray-300 hover:border-green-300 hover:bg-green-50/20"
        }`}
        onClick={() => onSelectPayment("cod")}
      >
        <div
          className={`p-3 rounded-xl transition
          ${selectedPayment === "cod" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"}
        `}
        >
          <CircleDollarSign className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">Cash on Delivery</span>
          <span className="text-sm text-gray-500">Pay when your food arrives</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
