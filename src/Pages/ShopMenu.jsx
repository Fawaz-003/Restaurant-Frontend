import React, { useState } from 'react';
import { menuItems, categories } from '../Components/Menu/MenuItems';
import MenuHeader from '../Components/Menu/MenuHeader';
import MenuItemCard from '../Components/Menu/MenuCard';
import CartSidebar from '../Components/Menu/CartSidebar';

const ShopMenu = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter best food items (you can define your own logic, e.g., rating > 4.5)
  const bestFoodItems = menuItems.filter(item => item.rating > 4.5);
  
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
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

  const updateQuantity = (id, delta) => {
    setCart(cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter((item) => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
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
        bestFoodItems={bestFoodItems} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:py-2 lg:flex lg:gap-6">
        <div className="flex-1">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Our Menu</h2>
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
        </div>

        <div className="hidden lg:block lg:w-96 lg:sticky lg:top-60 lg:self-start">
          <CartSidebar
            cart={cart}
            onUpdateQuantity={updateQuantity}
            getTotalPrice={getTotalPrice}
            getTotalItems={getTotalItems}
          />
        </div>
      </div>

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