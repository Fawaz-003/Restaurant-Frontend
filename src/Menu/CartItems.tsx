import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../utils/constant';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, delta: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex gap-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600 mb-2">₹{item.price}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="bg-white border border-gray-300 rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-semibold w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="bg-orange-500 text-white rounded-lg p-1 hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
      </div>
    </div>
  );
};

export default CartItem;