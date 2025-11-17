import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle,
  User,
  MessageSquare,
  ShoppingBag,
  Headphones,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      subInfo: "Mon-Fri 9AM-6PM EST",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Mail,
      title: "Email Us",
      info: "support@yourstore.com",
      subInfo: "We'll respond within 24 hours",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      info: "Chat with our team",
      subInfo: "Available 24/7",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: MapPin,
      title: "Visit Our Store",
      info: "123 Commerce Street",
      subInfo: "New York, NY 10001",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'order', label: 'Order Support', icon: ShoppingBag },
    { value: 'technical', label: 'Technical Support', icon: Headphones },
    { value: 'business', label: 'Business Partnership', icon: Globe }
  ];

  const storeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Sunday', hours: '11:00 AM - 5:00 PM' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <div className="w-full bg-green-100 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help! Reach out to us for any questions, support, or feedback.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center group">
              <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className={method.color} size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{method.title}</h3>
              <p className="text-gray-600 font-medium mb-1">{method.info}</p>
              <p className="text-sm text-gray-500">{method.subInfo}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">What can we help you with?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inquiryTypes.map(type => (
                      <label key={type.value} className="relative">
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type.value}
                          checked={formData.inquiryType === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.inquiryType === type.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <type.icon size={20} className={`mr-3 ${
                            formData.inquiryType === type.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            formData.inquiryType === type.value ? 'text-blue-800' : 'text-gray-700'
                          }`}>
                            {type.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone and Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Brief subject of your message"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Store Information Sidebar */}
          <div className="space-y-8">
            {/* Store Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2 text-blue-600" size={20} />
                Store Hours
              </h3>
              <div className="space-y-3">
                {storeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 font-medium">{schedule.day}</span>
                    <span className="text-gray-800 font-semibold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Phone className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Customer Service</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Mail className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">support@yourstore.com</p>
                    <p className="text-sm text-gray-500">General Support</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">123 Commerce Street</p>
                    <p className="text-sm text-gray-500">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Follow Us</h3>
              <div className="grid grid-cols-2 gap-3">
                <a href="#" className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Facebook size={20} className="mr-2" />
                  Facebook
                </a>
                <a href="#" className="flex items-center justify-center p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200">
                  <Twitter size={20} className="mr-2" />
                  Twitter
                </a>
                <a href="#" className="flex items-center justify-center p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200">
                  <Instagram size={20} className="mr-2" />
                  Instagram
                </a>
                <a href="#" className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                  <Youtube size={20} className="mr-2" />
                  YouTube
                </a>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Need Quick Answers?</h3>
              <p className="text-orange-100 mb-4">Check out our FAQ section for instant answers to common questions.</p>
              <button className="w-full bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                Visit FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <MapPin className="mr-2 text-red-600" size={24} />
                Find Our Store
              </h2>
              <p className="text-gray-600 mt-2">Visit us in person for a hands-on shopping experience</p>
            </div>
            <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto text-blue-600 mb-2" size={48} />
                <p className="text-lg font-semibold text-gray-800">Interactive Map</p>
                <p className="text-gray-600">123 Commerce Street, New York, NY 10001</p>
                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Support Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="text-blue-600" size={20} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Order Support</h4>
            <p className="text-gray-600 text-sm">Track your orders, returns, and exchanges</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Headphones className="text-green-600" size={20} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Technical Help</h4>
            <p className="text-gray-600 text-sm">Product setup, troubleshooting, and guides</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="text-purple-600" size={20} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Business Inquiries</h4>
            <p className="text-gray-600 text-sm">Partnerships, wholesale, and corporate sales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;