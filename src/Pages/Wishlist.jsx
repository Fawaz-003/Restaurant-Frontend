import React, { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useAppContext } from "../Context/AppContext";

// Professional Wishlist Component
const Wishlist = () => {
  const { wishlist, fetchWishlist, toggleWishlistItem, userData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cartKey = userData?._id ? `cart_${userData._id}` : "cart_guest";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchWishlist();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchWishlist]);

  const removeItem = async (item) => {
    try {
      await toggleWishlistItem(item);
      setMessage("Removed from wishlist");
      setTimeout(() => setMessage(""), 1500);
    } catch (error) {
      setMessage(error.message || "Unable to update wishlist");
      setTimeout(() => setMessage(""), 1500);
    }
  };

  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const idx = existingCart.findIndex(
      (c) => String(c.productId || c.id || c._id) === String(item.productId || item.id || item._id)
    );
    if (idx >= 0) {
      existingCart[idx].quantity = (existingCart[idx].quantity || 1) + 1;
    } else {
      existingCart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    setMessage("Added to cart");
    setTimeout(() => setMessage(""), 1500);
  };

  const items = useMemo(() => {
    return (wishlist || []).map((item) => ({
      ...item,
      id: item.productId || item.id || item._id,
      name: item.name || "Item",
      price: item.price ?? 0,
      image: item.image || "",
      rating: item.rating ?? 0,
      description: item.description || "",
    }));
  }, [wishlist]);

  const clearAll = async () => {
    for (const item of items) {
      await toggleWishlistItem(item);
    }
    setMessage("Cleared wishlist");
    setTimeout(() => setMessage(""), 1500);
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
              {!userData && (
                <p className="text-sm text-orange-600 mt-1">Login to sync wishlist across devices.</p>
              )}
              {message && (
                <p className="text-sm text-green-700 mt-2 bg-green-50 border border-green-100 rounded px-3 py-1 inline-block">
                  {message}
                </p>
              )}
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
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center text-gray-600">
            Loading wishlist...
          </div>
        ) : items.length === 0 ? (
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
                <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => removeItem(item)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition duration-200"
                    >
                      <Trash2 className="w-5 h-5 text-gray-600 hover:text-rose-600" />
                    </button>
                  </div>

                  {/* Real Product Image */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-3xl">No Image</div>
                  )}
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


      </div>
    </div>
  );
};

export default Wishlist;