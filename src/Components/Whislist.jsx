import React, { useState } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";

// Professional Wishlist Component
const Wishlist = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Chicken Biryani",
      price: 180,
      image: "/biryani.jpg",
      rating: 4.5,
      description: "Aromatic basmati rice cooked with tender chicken and exotic spices",
    },
    {
      id: 2,
      name: "Cheese Pizza",
      price: 240,
      image: "/pizza.jpg",
      rating: 4.7,
      description: "Thin crust pizza with mozzarella, cheddar, and parmesan cheese",
    },
    {
      id: 3,
      name: "Burger Deluxe",
      price: 150,
      image: "/burger.jpg",
      rating: 4.3,
      description: "Juicy beef patty with fresh vegetables and special sauce",
    },
  ]);

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addToCart = (item) => {
    console.log("Added to cart:", item);
    // Add to cart logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
                Wishlist
              </h1>
              <p className="text-gray-600 mt-2">Save your favorite items for later</p>
            </div>
            {items.length > 0 && (
              <div className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">{items.length}</span> items
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-rose-50 rounded-full inline-flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-rose-400 fill-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding items you love! They'll appear here for easy access.
              </p>
              {/* <button className="px-6 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition duration-200">
                Browse Collections
              </button> */}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition duration-200"
                    >
                      <Trash2 className="w-5 h-5 text-gray-600 hover:text-rose-600" />
                    </button>
                  </div>
                  {/* Placeholder for product image */}
                  <div className="text-5xl">🍔</div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm text-gray-600">{item.rating}</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition duration-200"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                 
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions Bar (when items exist) */}
        {items.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Wishlist Summary</h3>
                <p className="text-sm text-gray-600">
                  {items.length} items • Total: ₹
                  {items.reduce((sum, item) => sum + item.price, 0)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setItems([])}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Clear All
                </button>
                <button className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition duration-200">
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;