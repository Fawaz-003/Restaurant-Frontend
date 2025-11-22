import React from 'react';
import { Info, ArrowRight } from "lucide-react";
import { Shop } from '../utils/constant';

interface ShopCardProps {
  shop: Shop;
  onShowDetails: (shop: Shop) => void;
  onVisitShop: (shopId: number) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onShowDetails, onVisitShop }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative border border-gray-100">
      {/* Image */}
      <div className="overflow-hidden relative">
        <img
          src={shop.image}
          alt={shop.name}
          className="h-52 w-full object-cover rounded-t-2xl group-hover:scale-110 transition-transform duration-500"
        />

        <div className="hidden lg:block absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails(shop);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        <div className="lg:hidden absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails(shop);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-xl text-gray-800 mb-2">{shop.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{shop.description}</p>

        <button
          onClick={() => onVisitShop(shop.id)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <span className="flex items-center gap-2">
            Visit Shop <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShopCard;