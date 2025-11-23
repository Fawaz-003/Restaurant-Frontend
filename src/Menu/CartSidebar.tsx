import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { CartItem as CartItemType } from '../utils/constant';
import CartItem from './CartItems';

interface CartSidebarProps {
  cart: CartItemType[];
  isMobile?: boolean;
  onClose?: () => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  isMobile = false,
  onClose,
  onUpdateQuantity,
  getTotalPrice,
  getTotalItems
}) => {
  return (
    <div className={`bg-white ${isMobile ? 'w-full max-w-md h-full shadow-2xl flex flex-col' : 'rounded-2xl shadow-lg overflow-hidden flex flex-col'}`}>
      {/* Header - Fixed height */}
      <div className="bg-orange-500 text-white p-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold">Your Cart</h2>
          <p className="text-sm opacity-90">{getTotalItems()} items</p>
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Cart Items - Scrollable with fixed height */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-4 max-h-60'}`}>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-4" />
            <p className="text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-6 space-y-4 flex-shrink-0">
          <div className="flex justify-between items-center text-md">
            <span className="font-semibold">Subtotal:</span>
            <span className="font-bold text-gray-900">₹{getTotalPrice()}</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-orange-600">
              ₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}
            </span>
          </div>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;