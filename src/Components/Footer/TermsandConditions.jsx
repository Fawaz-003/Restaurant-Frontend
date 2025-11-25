"use client";
import React from "react";

const TermsandConditions = () => {
  const terms = [
    {
      title: "Agreement With Our Service",
      text: "By using our platform, you accept these terms and agree to comply with our policies, including updates made in the future. If you disagree, please discontinue usage."
    },
    {
      title: "User Data Responsibility",
      text: "You agree to provide accurate personal information and prevent misuse of your login details. Fraudulent activity can result in permanent suspension or legal actions."
    },
    {
      title: "Transactions & Payments",
      text: "Payments are securely processed through licensed gateways. We never store your complete card details. Restaurant partners control menu items, pricing, and availability."
    },
    {
      title: "Refunds & Disputes",
      text: "Refunds are applicable only if orders are undelivered, incorrect, or damaged, subject to inspection. Refund timelines are dependent on banks and payment gateways."
    },
    {
      title: "Delivery Time & Conditions",
      text: "Delivery timelines vary due to weather, traffic, and restaurant preparation. Our platform is not liable for external delays beyond operational control."
    },
    {
      title: "Privacy & Data Protection",
      text: "We safeguard your information with strong encryption, secure storage, and limited access. Data may only be shared for legal compliance or fraud prevention."
    },
    {
      title: "Policy Updates",
      text: "The Terms & Conditions may be updated without prior notice. Continued use of our services means you accept updated terms automatically."
    },
  ];

  return (
    <div className="bg-[#fdf9f5] min-h-screen">
      {/* HERO */}
      <section className="px-6 md:px-24 py-20 text-center">
        <h1 className="font-extrabold text-[42px] md:text-[64px] text-[#272727] leading-tight tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-gray-500 text-lg md:text-xl mt-4 max-w-2xl mx-auto">
          A transparent agreement designed to protect both our customers and our partners.
        </p>
      </section>

      {/* TERMS CONTENT */}
      <section className="px-6 md:px-24 pb-24">
        <div className="space-y-14 max-w-5xl mx-auto">
          {terms.map((item, index) => (
            <div
              key={index}
              className="relative group bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-xl border border-white/60 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Accent Line */}
              <div className="absolute -left-1 top-6 h-10 w-1.5 bg-gradient-to-b from-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>

              <h2 className="text-2xl md:text-3xl font-bold text-[#2c2c2c] mb-4">
                {item.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-[16px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* FOOT NOTE */}
        <p className="text-gray-400 text-sm text-center mt-16">
          For legal requests, contact: <span className="text-gray-600 font-semibold">legal@foodapp.com</span>
        </p>
      </section>
    </div>
  );
};

export default TermsandConditions;
