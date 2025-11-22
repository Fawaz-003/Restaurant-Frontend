import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { MenuItem , CartItem } from '../utils/constant';
import { menuItems , categories } from '../Menu/MenuItems';
import MenuHeader from '../Menu/MenuHeader';
import MenuItemCard from '../Menu/MenuCard';
import CartSidebar from '../Menu/CartSidebar';

const ShopMenu = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter((item) => item.quantity > 0));
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">
      <MenuHeader
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        totalItems={getTotalItems()}
        categories={categories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onShowCart={() => setShowCart(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 lg:flex lg:gap-6">
        <div className="flex-1">
          {/* <div className="hidden lg:block relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
              />
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 text-lg">No items found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Cart Sidebar */}
        <div className="hidden lg:block lg:w-96 lg:sticky lg:top-36 lg:self-start">
          <CartSidebar
            cart={cart}
            onUpdateQuantity={updateQuantity}
            getTotalPrice={getTotalPrice}
            getTotalItems={getTotalItems}
          />
        </div>
      </div>

      {/* Mobile Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end lg:hidden">
          <CartSidebar
            cart={cart}
            isMobile={true}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            getTotalPrice={getTotalPrice}
            getTotalItems={getTotalItems}
          />
        </div>
      )}
    </div>
  );
};

export default ShopMenu;