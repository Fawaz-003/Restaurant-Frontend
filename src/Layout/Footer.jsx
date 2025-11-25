import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaXTwitter,
  FaStar,
} from "react-icons/fa6";
import { SiGoogleplay } from "react-icons/si";

const Footer = () => {
  return (
    <>
      {/* Mobile Footer */}
      <div className="bg-orange-50 border-t border-gray-200 md:hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">My-Food 🍽️</h3>
          <p className="text-gray-700 text-sm mb-4">
            With My-Food, every meal is a celebration!
          </p>

          <div className="flex justify-center space-x-3">
            <button className="flex items-center space-x-2 bg-white shadow-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-orange-100 transition">
              <SiGoogleplay className="text-base" />
              <span>Get App</span>
            </button>

            <button className="flex items-center space-x-2 bg-white shadow-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-orange-100 transition">
              <FaStar className="text-yellow-500 text-base" />
              <span>Rate Us</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gradient-to-br from-orange-50 via-white to-orange-50 text-black px-6 py-12 md:px-20 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 pb-8">

          {/* Logo */}
          <div>
            <h1 className="text-4xl font-extrabold text-orange-600 cursor-pointer">
              My-Food
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Finest meals at your fingertips.
            </p>
          </div>

          {/* For Restaurants */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">For Restaurants</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/partnerwithus" className="hover:text-orange-600 transition">Partner With Us</Link></li>
              <li><Link to="/appforus" className="hover:text-orange-600 transition">Apps For You</Link></li>
            </ul>
          </div>

          {/* For Delivery Partners */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">For Delivery Partners</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/delivery" className="hover:text-orange-600 transition">Partner With Us</Link></li>
              <li><Link to="/delivery-app" className="hover:text-orange-600 transition">Apps For You</Link></li>
            </ul>
          </div>

          {/* Learn More */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Learn More</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/privacy-Policy" className="hover:text-orange-600 transition">Privacy Policy</Link></li>
              <li><Link to="/security" className="hover:text-orange-600 transition">Security</Link></li>
              <li><Link to="/terms&conditions" className="hover:text-orange-600 transition">Terms & Conditions</Link></li>
              <li><Link to="/helpcenter" className="hover:text-orange-600 transition">Help & Support</Link></li>
              <li><Link to="/reportfraud" className="hover:text-orange-600 transition">Report a Fraud</Link></li>
            </ul>
          </div>

          {/* Socials + App Stores */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
            <div className="flex gap-3 text-xl text-gray-700 mb-4">
              {[<FaLinkedin />, <FaInstagram />, <FaYoutube />, <FaFacebook />, <FaXTwitter />].map((icon, idx) => (
                <span key={idx} className="hover:text-orange-600 hover:scale-110 transition cursor-pointer">
                  {icon}
                </span>
              ))}
            </div>

            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              className="cursor-pointer w-40 mb-3"
              alt="App Store"
            />

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              className="cursor-pointer w-40"
              alt="Play Store"
            />
          </div>
        </div>

        {/* Footer Bottom Text */}
        <p className="text-xs text-center mt-6 text-gray-600">
          © 2025 My-Food Pvt Ltd. All Rights Reserved. | By continuing, you agree to our
          <span className="text-orange-600 cursor-pointer hover:underline"> Terms, Privacy & Cookies.</span>
        </p>
      </footer>
    </>
  );
};

export default Footer;
