import React from "react";
import {
  Store,
  CheckCircle2,
  Apple,
  Play,
} from "lucide-react";

const AppForUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="text-orange-500 w-8 h-8" />
            <h1 className="text-2xl font-bold text-orange-500">FoodApp</h1>
          </div>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
            Partner Login
          </button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Grow Your Restaurant With Our Owner App
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Manage orders, track revenue, update menus, and boost online sales — directly from your phone.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            <a
              href="#"
              className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              <Play className="w-6 h-6" />
              <div>
                <p className="text-xs">GET IT ON</p>
                <p className="text-lg font-bold -mt-1">Google Play</p>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              <Apple className="w-6 h-6" />
              <div>
                <p className="text-xs">Download on the</p>
                <p className="text-lg font-bold -mt-1">App Store</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-10 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Trusted by thousands of restaurants
          </h3>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-orange-500">10K+</p>
              <p className="text-sm text-gray-600">Partners</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-orange-500">50%</p>
              <p className="text-sm text-gray-600">Growth</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-orange-500">24/7</p>
              <p className="text-sm text-gray-600">Support</p>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Why Restaurant Owners Love Our App
          </h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            {[
              "Fast order management in real-time",
              "Control menus, pricing & availability",
              "Track earnings & payouts instantly",
              "Dedicated support for restaurants",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="text-orange-500 w-6 h-6 mt-1" />
                <p className="text-gray-700 text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppForUs;
