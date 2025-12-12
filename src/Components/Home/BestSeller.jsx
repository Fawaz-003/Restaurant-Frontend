import { TrendingUp, Star } from 'lucide-react';
import React from 'react'

const BestSeller = () => {
  const bestSellers = [
    { 
      id: 1, 
      name: "Margherita Pizza", 
      price: "$12.99", 
      rating: 4.9, 
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop&auto=format" 
    },
    { 
      id: 2, 
      name: "Classic Burger", 
      price: "$9.99", 
      rating: 4.7, 
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format" 
    },
    { 
      id: 3, 
      name: "Salmon Roll", 
      price: "$15.99", 
      rating: 4.8, 
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&auto=format" 
    },
    { 
      id: 4, 
      name: "Spicy Ramen", 
      price: "$11.99", 
      rating: 4.6, 
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&auto=format" 
    },
  ];

  const duplicatedBestSellers = [...bestSellers, ...bestSellers];

  return (
    <div>
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-orange-500" />
            Best Sellers
          </h2>
          <div className="space-y-4">
            {bestSellers.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-orange-600 font-bold">{item.price}</span>
                      <div className="flex items-center text-xs">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <TrendingUp className="mr-2 text-orange-500 w-5 h-5" />
          Best Sellers
        </h2>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-infinite-scroll-slow">
            {duplicatedBestSellers.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-2 min-w-[120px] flex-shrink-0 border border-gray-100 mx-1"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs text-gray-800 line-clamp-2 leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BestSeller;