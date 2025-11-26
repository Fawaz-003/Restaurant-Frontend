import React from "react";
import { ShieldCheck, AlertTriangle, Headset, FileSearch } from "lucide-react";

const FraudAndSupport = () => {
  const fraudItems = [
    {
      icon: <AlertTriangle className="w-10 h-10 text-red-500" />,
      title: "Report a Scam",
      desc: "If you notice suspicious activities, fake deliveries, or false identity claims, report immediately.",
    },
    {
      icon: <FileSearch className="w-10 h-10 text-yellow-600" />,
      title: "Track Fraud Cases",
      desc: "Stay connected with our support team to monitor the progress of your fraud investigation.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
      title: "Verified Sellers Only",
      desc: "We ensure all restaurants & delivery partners are verified to provide you a safe experience.",
    },
    {
      icon: <Headset className="w-10 h-10 text-blue-600" />,
      title: "24/7 Support",
      desc: "Our team is available round-the-clock to resolve queries, fraud, refunds, and safety issues.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-6 md:px-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Fraud Protection & Support
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Your safety is our top priority. We take strict actions against fraud to ensure secure transactions.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {fraudItems.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl duration-300 text-center"
          >
            <div className="flex justify-center">{item.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">
              {item.title}
            </h3>
            <p className="text-gray-600 mt-2 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom Help Box */}
      <div className="mt-16 bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Need Help With a Fraud Case?
        </h2>
        <p className="text-gray-600 mt-2">
          Contact our support team and get immediate assistance for fraud, refunds, or complaints.
        </p>

        <button className="mt-6 bg-orange-500 hover:bg-orange-600 duration-300 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md">
          Contact Support
        </button>
      </div>
    </section>
  );
};

export default FraudAndSupport;
