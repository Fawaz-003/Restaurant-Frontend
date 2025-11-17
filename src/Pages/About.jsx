import React from 'react';
import { Users, Award, Globe, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      number: "10M+",
      label: "Happy Customers"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      number: "15+",
      label: "Years Experience"
    },
    {
      icon: <Globe className="w-8 h-8 text-green-600" />,
      number: "50+",
      label: "Countries Served"
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      number: "99%",
      label: "Customer Satisfaction"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                About Our Company
              </h2>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Crafting Excellence Since 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> 2008</span>
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              We are passionate about creating high-quality products that enhance your lifestyle. 
              Our journey began with a simple mission: to bridge the gap between innovation and 
              accessibility, bringing you the finest collection of products at unbeatable prices.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              From humble beginnings as a small family business, we've grown into a global brand 
              trusted by millions. Our commitment to quality, customer satisfaction, and continuous 
              innovation has made us a leader in the industry. Every product in our collection is 
              carefully curated and tested to ensure it meets our high standards.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                Learn More
              </button>
              <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold px-8 py-3 rounded-lg transition-all duration-200">
                Our Story
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                alt="Our team working together"
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
            
            {/* Floating Achievement Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Award Winner</p>
                  <p className="text-xs text-gray-600">Best E-commerce 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our numbers speak for themselves. Join millions of satisfied customers worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 group-hover:bg-gray-100 rounded-2xl p-6 transition-colors duration-200">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mission Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-90">
              "To democratize access to quality products while building lasting relationships 
              with our customers through exceptional service, innovative solutions, and 
              unwavering commitment to excellence."
            </p>
            <div className="mt-8">
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg">
                Join Our Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;