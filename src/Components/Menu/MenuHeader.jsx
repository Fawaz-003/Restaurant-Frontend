import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';



const MenuHeader = ({
  totalItems,
  onShowCart,
  bestFoodItems
}) => {
  const desktopBestFoodItems = bestFoodItems.slice(0, 4);
  const duplicatedDesktopBestFoodItems = [...desktopBestFoodItems, ...desktopBestFoodItems];

  const duplicatedBestFoodItems = [...bestFoodItems, ...bestFoodItems];

  return (
    <div className="bg-white shadow-md sticky top-15 sm:top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:py-2">
        <div className="lg:hidden flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-sm sm:text-lg font-bold text-gray-800">Highly Recommended</h2>
          </div>
          <button
            onClick={onShowCart}
            className="relative bg-orange-500 text-white py-1 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute top-1 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {bestFoodItems.length > 0 && (
          <div className="mb-4">
            <div className="hidden lg:flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-800">Highly Recommended</h2>
            </div>

            <div className="lg:hidden relative overflow-hidden p-1 rounded-xl">
              <div className="flex animate-infinite-scroll-slow gap-2">
                {duplicatedBestFoodItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center space-x-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer p-2 min-w-[160px] flex-shrink-0"
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs text-gray-800 line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 font-bold text-xs">
                          ₹{item.price}
                        </span>
                        <div className="flex items-center text-xs text-gray-600">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/80 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/80 to-transparent pointer-events-none"></div>
            </div>

            <div className="hidden lg:block relative overflow-hidden rounded-xl">
              <div className="flex animate-infinite-scroll-desktop gap-4">
                {duplicatedDesktopBestFoodItems.map((item, index) => (
                  <div
                    key={`${item.id}-desktop-${index}`}
                    className="flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer px-3 py-2 min-w-[200px] flex-shrink-0 border border-gray-200"
                  >
                    <div className="w-20 h-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                        {item.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-600">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/90 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent pointer-events-none"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuHeader;