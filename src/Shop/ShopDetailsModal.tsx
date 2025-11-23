import React from 'react';
import { X, CircleUserRound, PhoneCall, MapPin } from "lucide-react";
import { Shop } from '../utils/constant';

interface ShopDetailsModalProps {
  shop: Shop | null;
  onClose: () => void;
}

const ShopDetailsModal: React.FC<ShopDetailsModalProps> = ({ shop, onClose }) => {
  if (!shop) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 relative animate-in fade-in-90 zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-10"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {shop.name}
        </h3>
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          {shop.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-gray-700 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CircleUserRound className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-medium text-gray-800">Owner</p>
              <p className="text-sm text-gray-600">{shop.owner}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <PhoneCall className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-800">Contact</p>
              <p className="text-sm text-gray-600">{shop.contact}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">Location</p>
              <p className="text-sm text-gray-600">
                {shop.location.title}, {shop.location.desc}
                <br />
                <span className="text-gray-500">{shop.location.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailsModal;