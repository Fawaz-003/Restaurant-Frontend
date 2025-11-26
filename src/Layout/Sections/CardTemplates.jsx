import React from 'react';
import { ChevronRight } from 'lucide-react';

const DiscountCards = () => {
  const products = [
    {
      id: 1,
      name: "Wrist Watches",
      discount: "Min. 90% Off",
      image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=300&h=300&fit=crop",
      bgColor: "bg-white"
    },
    {
      id: 2,
      name: "Smart Watches", 
      discount: "Min. 40% Off",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      bgColor: "bg-white",
      badge: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=60&h=30&fit=crop"
    },
    {
      id: 3,
      name: "Men's Sweatshirts",
      discount: "Min. 70% Off", 
      image: "https://images.unsplash.com/photo-1556821840-3a9c6dcb40b1?w=300&h=300&fit=crop",
      bgColor: "bg-gradient-to-br from-cyan-400 via-yellow-300 to-lime-400"
    },
    {
      id: 4,
      name: "Laptops",
      discount: "Min. 30% Off",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop", 
      bgColor: "bg-gradient-to-br from-pink-300 to-purple-400"
    }
  ];

  return (
    <div className="w-full bg-[#e8ecf3] flex py-3 sm:py-5">
      <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              Discounts for you
            </h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 sm:p-2 rounded-full transition-colors duration-200">
              <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {/* Products Grid */}
          <div className="px-3 sm:px-6 md:px-10 py-3 sm:py-5 pb-4 sm:pb-6">
            {/* Responsive grid: 1 col on mobile, 2 cols on larger screens */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  {/* Product Image Container */}
                  <div className={`${product.bgColor} h-24 sm:h-28 md:h-32 lg:h-36 flex items-center justify-center p-3 sm:p-4 relative`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-3 sm:p-4 bg-white">
                    <h3 className="font-medium text-gray-800 text-xs sm:text-sm md:text-base mb-1">
                      {product.name}
                    </h3>
                    <p className="text-green-600 font-semibold text-xs sm:text-sm md:text-base">
                      {product.discount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCards;