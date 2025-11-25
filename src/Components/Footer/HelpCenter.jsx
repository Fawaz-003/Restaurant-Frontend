"use client";
import React from "react";
import { MessageCircle, PhoneCall, ShoppingBag, UtensilsCrossed, CreditCard, ShieldCheck } from "lucide-react";

const HelpCenter = () => {
  const helpOptions = [
    { icon: <ShoppingBag className="w-6 h-6" />, title: "Order Issues", subtitle: "Track, cancel or modify orders" },
    { icon: <CreditCard className="w-6 h-6" />, title: "Payments & Refunds", subtitle: "Refund status, billing questions" },
    { icon: <UtensilsCrossed className="w-6 h-6" />, title: "Food Quality", subtitle: "Report food or restaurant issues" },
    { icon: <PhoneCall className="w-6 h-6" />, title: "Delivery Support", subtitle: "Late delivery, agent support" },
    { icon: <MessageCircle className="w-6 h-6" />, title: "Chat Support", subtitle: "Talk with an agent instantly" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Privacy & Safety", subtitle: "Account protection & privacy" }
  ];

  return (
    <div className="bg-[#fdfbf7] min-h-screen flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="text-center py-10 px-5">
        <h1 className="text-[34px] md:text-[50px] font-extrabold text-[#272727]">
          Help Center
        </h1>
        <p className="text-gray-500 text-base md:text-lg mt-2">
          We’re here to support you anytime.
        </p>
      </header>

      {/* HELP GRID */}
      <section className="px-6 md:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {helpOptions.map((item, i) => (
            <button
              key={i}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className="bg-orange-100 text-orange-600 w-12 h-12 flex items-center justify-center rounded-xl mb-3 group-hover:bg-orange-500 group-hover:text-white transition">
                {item.icon}
              </div>
              <h3 className="font-bold text-[#333] text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.subtitle}</p>
            </button>
          ))}
        </div>
      </section>

      {/* CONTACT FOOTER */}
      <footer className="text-center py-7">
        <p className="text-gray-500 text-sm">Need urgent support?</p>
        <p className="text-gray-700 text-base md:text-lg font-semibold">
          Call: <span className="text-orange-600">+91 98765 43210</span>
        </p>
      </footer>
    </div>
  );
};

export default HelpCenter;
