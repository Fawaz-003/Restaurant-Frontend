import React, { useState } from "react";

const PartnerWithUs = () => {
  const [loginMethod, setLoginMethod] = useState("mobile");
  const [formData, setFormData] = useState({
    mobile: "",
    restaurantId: "",
  });
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form submitted:", formData);
};

  const steps = [
    {
      number: "STEP 1",
      title: "Install the Restaurant Owner App",
      description: "Download our dedicated app for restaurant partners",
    },
    {
      number: "STEP 2",
      title: "Login/Register using your phone number",
      description: "Secure access with OTP verification",
    },
    {
      number: "STEP 3",
      title: "Enter restaurant details",
      description: "Complete your profile and start receiving orders",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-orange-500">FoodApp</div>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300">
            Partner Login
          </button>
        </div>
      </header>

      {/* 2 Column Grid */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ====================== LEFT (Login + Form) ====================== */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Increase your online orders
              </h1>
              <p className="text-gray-600">Get your restaurant delivery-ready in 24hrs!</p>
            </div>

            {/* Login Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setLoginMethod("mobile")}
                className={`flex-1 py-3 text-sm  sm:text-xl rounded-md font-medium transition ${
                  loginMethod === "mobile" ? "bg-white text-orange-500 shadow-sm" : "text-gray-600"
                }`}
              >
                Mobile Number
              </button>
              <button
                onClick={() => setLoginMethod("id")}
                className={`flex-1 py-3 rounded-md text-sm sm:text-xl font-medium transition ${
                  loginMethod === "id" ? "bg-white text-orange-500 shadow-sm" : "text-gray-600"
                }`}
              >
                Restaurant ID
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a mobile number or restaurant ID to continue
                </label>

                {loginMethod === "mobile" ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleInputChange}
                    placeholder="Enter Restaurant ID"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 shadow-lg"
              >
                Continue
              </button>

              <p className="text-center text-xs text-gray-500">
                By logging in, I agree to FoodApp’s{" "}
                <a className="text-orange-500 hover:underline" href="#">
                  terms & conditions
                </a>
              </p>
            </form>
          </div>

          <div className="space-y-8">
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 text-start mb-8">
                In just 3 easy steps
              </h2>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{step.number.split(" ")[1]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-10">
              <h3 className="text-xl font-bold text-gray-700 text-center mb-8">
                Join our growing network 🚀
              </h3>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-xl sm:text-3xl font-bold text-orange-500">10K+</p>
                  <p className="text-sm text-gray-600">Partners</p>
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-bold text-orange-500">50%</p>
                  <p className="text-sm text-gray-600">Growth</p>
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-bold text-orange-500">24/7</p>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PartnerWithUs;
