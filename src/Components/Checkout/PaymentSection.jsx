import React from "react";
import { Smartphone, CircleDollarSign } from "lucide-react";

const PaymentSection = ({
  selectedPayment,
  onSelectPayment,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

      <h3 className="text-lg sm:text-2xl font-bold mb-6 text-gray-800">
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
          <span className="font-semibold text-[12px] sm:text-lg text-gray-800">
            Pay Online (UPI / Card / NetBanking)
          </span>
          <span className="hidden sm:block text-sm text-gray-500">
            Secure • Fast • Recommended
          </span>

        </div>

      </div>

      {/* CASH ON DELIVERY */}
      <div
        className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 mt-4
        border
        ${selectedPayment === "cod"
            ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-xl scale-[1.02]"
            : "border-gray-300 hover:border-green-300 hover:bg-green-50/20"
          }`}
        onClick={() => {
          onSelectPayment("cod");
        }}
      >
        <div
          className={`p-3 rounded-xl transition
          ${selectedPayment === "cod" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"}
        `}
        >
          <CircleDollarSign className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-[12px] sm:text-lg text-gray-800">Cash on Delivery</span>
          <span className="hidden sm:block text-sm text-gray-500">
            Pay when your food arrives
          </span>

        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
