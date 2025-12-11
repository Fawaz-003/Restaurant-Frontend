import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MenuHeader from '../Components/Menu/MenuHeader';
import MenuItemCard from '../Components/Menu/MenuCard';
import CartSidebar from '../Components/Menu/CartSidebar';
import { useAppContext } from '../Context/AppContext';

const ShopMenu = () => {
  const { id: shopId } = useParams();
  const location = useLocation();
  const {
    shops,
    menus,
    menuLoading,
    menuError,
    fetchMenuByShop,
    userData,
    wishlist,
    toggleWishlistItem,
  } = useAppContext();

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadError, setLoadError] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState(null);

  const placeholderImage =
    "https://images.unsplash.com/photo-1544145945-f90425340c7b?auto=format&fit=crop&w=800&q=80";

  const cartKey = userData?._id ? `cart_${userData._id}` : "cart_guest";

  // Restore cart from storage and optional navigation state
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(cartKey) || "[]");
    if (stored?.length) {
      setCart(stored);
    }
    if (location.state?.cart && location.state?.preserveCart) {
      setCart(location.state.cart);
    }
  }, [location.state, cartKey]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  const currentShop = useMemo(() => {
    const found = (shops || []).find(
      (shop) => String(shop._id || shop.id || shop.storeId || shop.shopId || shop.slug || "") === String(shopId)
    );
    if (!found) return null;
    return {
      id: found._id || found.id || found.storeId || found.shopId || shopId,
      name: found.storeName || found.name || found.title || "Restaurant",
      image: found.image?.url || found.image || null,
      address:
        found.address ||
        found.location?.address ||
        found.location?.title ||
        "",
    };
  }, [shops, shopId]);

  useEffect(() => {
    const loadMenu = async () => {
      if (!shopId) return;
      try {
        setLoadError(null);
        const existing = menus?.[shopId];
        if (existing) {
          setMenuItems(existing);
        } else {
          const data = await fetchMenuByShop(shopId);
          setMenuItems(data);
        }
      } catch (error) {
        setLoadError(error.message || "Failed to load menu");
      }
    };

    loadMenu();
  }, [fetchMenuByShop, menus, shopId]);

  const normalizedMenu = useMemo(() => {
    return (menuItems || []).map((item, index) => ({
      id: item._id || item.id || index,
      name: item.foodName || item.name || "Menu item",
      category: item.category || "All",
      price: item.price ?? 0,
      image: item.image?.url || item.image || placeholderImage,
      description: item.description || "No description available.",
      rating: item.rating || 4.5,
      isVeg: item.isVeg,
    }));
  }, [menuItems]);

  const categories = useMemo(() => {
    const unique = new Set(["All"]);
    normalizedMenu.forEach((item) => {
      if (item.category) unique.add(item.category);
    });
    return Array.from(unique);
  }, [normalizedMenu]);

  // Filter best food items (simple pick of top rated items)
  const bestFoodItems = normalizedMenu
    .filter((item) => (item.rating ?? 0) >= 4.5)
    .slice(0, 6);
  
  const filteredItems = normalizedMenu.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const wishlistSet = useMemo(() => {
    const ids = new Set();
    (wishlist || []).forEach((w) => {
      const key = w.productId || w._id || w.id;
      if (key) ids.add(String(key));
    });
    return ids;
  }, [wishlist]);

  const addToCart = (item) => {
    const itemWithShop = {
      ...item,
      shopId: currentShop?.id || item.shopId,
      shopName: currentShop?.name || item.shopName,
      shopImage: currentShop?.image || item.shopImage,
    };
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...itemWithShop, quantity: 1 }]);
    }
  };

  const handleToggleWishlist = async (item) => {
    try {
      await toggleWishlistItem({
        ...item,
        shopId: currentShop?.id || item.shopId,
        shopName: currentShop?.name || item.shopName,
        shopImage: currentShop?.image || item.shopImage,
      });
      setWishlistMessage(`${item.name || "Item"} wishlist updated`);
      setTimeout(() => setWishlistMessage(null), 1600);
    } catch (error) {
      setWishlistMessage(error.message || "Unable to update wishlist");
      setTimeout(() => setWishlistMessage(null), 1600);
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
    <div className="min-h-screen ">
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
            {wishlistMessage && (
              <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                {wishlistMessage}
              </div>
            )}
            {menuLoading && (
              <p className="text-gray-600">Loading menu...</p>
            )}
            {(menuError || loadError) && !menuLoading && (
              <p className="text-red-600">Failed to load menu: {menuError || loadError}</p>
            )}
            {!menuLoading && !(menuError || loadError) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlistSet.has(String(item.id))}
                  />
                ))}

                {filteredItems.length === 0 && (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-gray-500 text-lg">No items found matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block lg:w-96 lg:sticky lg:top-60 lg:self-start">
          <CartSidebar
            cart={cart}
            onUpdateQuantity={updateQuantity}
            getTotalPrice={getTotalPrice}
            getTotalItems={getTotalItems}
            shopInfo={currentShop}
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
            shopInfo={currentShop}
          />
        </div>
      )}
    </div>
  );
};

export default ShopMenu;