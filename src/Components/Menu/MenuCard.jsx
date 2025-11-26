import React from 'react';
import { Star, Plus } from 'lucide-react';



const MenuItemCard = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      <div className="flex md:hidden">
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{item.rating}</span>
          </div>
        </div>

        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div className="flex-1">
            <h3 className="font-bold text-base text-gray-900 mb-1 truncate">{item.name}</h3>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
            <button
              onClick={() => onAddToCart(item)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg text-sm whitespace-nowrap"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
  
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{item.rating}</span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{item.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
            <button
              onClick={() => onAddToCart(item)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;