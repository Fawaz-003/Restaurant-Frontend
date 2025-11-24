import React from "react";
import { FaLinkedin, FaInstagram, FaYoutube, FaFacebook, FaXTwitter, FaStar } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { SiGoogleplay } from "react-icons/si";

const Footer = () => {
  return (
    <>
      <div className="bg-orange-50 border-t border-gray-200 md:hidden">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live It Up</h3>
            <p className="text-gray-600 mb-4">
              With My-Food, every meal is a celebration
            </p>

            <div className="flex justify-center space-x-4">
              <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SiGoogleplay className="text-base" />
                <span>Get the app</span>
              </button>
              <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                 <FaStar className="text-yellow-500 text-base" />
                <span>Rate us</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="hidden md:block bg-gray-200 text-black px-6 py-10 md:px-20">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 border-b border-gray-800 pb-8">

          {/* Logo */}
          <div>
            <h1 className="text-4xl font-bold text-black cursor-pointer">My-Food</h1>
          </div>

          {/* For Restaurants */}
          <div>
            <h3 className="font-semibold text-black mb-3">For Restaurants</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/partner" className="hover:text-black hover:underline transition">Partner With Us</a></li>
              <li><a href="/restaurant-app" className="hover:text-black hover:underline transition">Apps For You</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-3">For Delivery Partners</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/delivery" className="hover:text-black hover:underline transition">Partner With Us</a></li>
              <li><a href="/delivery-app" className="hover:text-black hover:underline transition">Apps For You</a></li>
            </ul>
          </div>

          {/* Learn More */}
          <div>
            <h3 className="font-semibold text-black mb-3">Learn More</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="hover:text-black hover:underline transition">Privacy</a></li>
              <li><a href="/security" className="hover:text-black hover:underline transition">Security</a></li>
              <li><a href="/terms" className="hover:text-black hover:underline transition">Terms of Service</a></li>
              <li><a href="/support" className="hover:text-black hover:underline transition">Help & Support</a></li>
              <li><a href="/fraud" className="hover:text-black hover:underline transition">Report a Fraud</a></li>
              <li><a href="/blog" className="hover:text-black hover:underline transition">Blog</a></li>
            </ul>
          </div>

          {/* Social & App Section */}
          <div>
            <h3 className="font-semibold text-black mb-3">Social Links</h3>

            <div className="flex gap-3 text-xl mb-4">
              {[
                <FaLinkedin key="linkedin" />, 
                <FaInstagram key="instagram" />, 
                <FaYoutube key="youtube" />, 
                <FaFacebook key="facebook" />, 
                <FaXTwitter key="twitter" />
              ].map((Icon, idx) => (
                <a key={idx} href="#" className="hover:text-black hover:scale-110 transition-transform">
                  {Icon}
                </a>
              ))}
            </div>

            {/* App Store Buttons */}
            <a href="#" className="block w-40 mb-2">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                className="cursor-pointer"
                alt="App Store"
              />
            </a>

            <a href="#" className="block w-40">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                className="cursor-pointer"
                alt="Play Store"
              />
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-xs text-center mt-6 text-gray-500">
          By continuing past this page, you agree to our Terms of Service, Cookie Policy,
          Privacy Policy and Content Policies. All trademarks are properties of their respective owners.
          <br />© 2025 My-Food Pvt Ltd. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;