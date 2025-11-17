// Cart utility functions for managing cart with backend API

// Get local cart from localStorage
const getLocalCart = () => {
  try {
    const localCart = localStorage.getItem('local-cart');
    return localCart ? JSON.parse(localCart) : [];
  } catch (error) {
    console.error('Error getting local cart:', error);
    return [];
  }
};

// Save local cart to localStorage
const saveLocalCart = (cart) => {
  try {
    localStorage.setItem('local-cart', JSON.stringify(cart));
    // Dispatch custom event to notify cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error saving local cart:', error);
  }
};

// Get cart from backend or local storage
export const getCart = async (axios) => {
  const token = localStorage.getItem('user-token');
  if (token) {
    try {
      const response = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data || [];
    } catch (error) {
      console.error('Error getting cart from backend:', error);
      return [];
    }
  } else {
    return getLocalCart();
  }
};

// Add item to cart
export const addToCart = async (axios, product, variant, quantity = 1) => {
  const token = localStorage.getItem('user-token');
  const payload = {
    product: { ...product, images: product.images.slice(0, 1) }, // Store only essential product data
    productId: product._id,
    quantity: quantity,
    size: variant.size,
    color: variant.color,
    price: variant.price,
  };

  if (token) {
    try {
    const response = await axios.post('/api/cart/add', {
      ...payload,
      product: undefined, // Don't send the whole product object to backend
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Dispatch custom event to notify cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    return { 
      success: true, 
      message: response.data.message || 'Added to cart successfully',
      cart: response.data.cart 
    };    
    } catch (error) {
      console.error('Error adding to cart (backend):', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to cart' 
      };
    }
  } else {
    // Handle local cart
    const cart = getLocalCart();
    const existingItemIndex = cart.findIndex(
      item => item.productId === product._id && item.size === variant.size && item.color === variant.color
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(payload);
    }
    saveLocalCart(cart);
    return {
      success: true,
      message: 'Added to cart successfully',
      cart: cart
    };
  }
};

// Remove item from cart
export const removeFromCart = async (axios, productId, size, color) => {
  const token = localStorage.getItem('user-token');
  if (token) {
    try {
    const response = await axios.delete(`/api/cart/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { size, color },
    });
    
    // Dispatch custom event to notify cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    return { 
      success: true,
      message: response.data.message 
    };
    } catch (error) {
      console.error('Error removing from cart (backend):', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from cart' 
      };
    }
  } else {
    let cart = getLocalCart();
    cart = cart.filter(item => !(item.productId === productId && item.size === size && item.color === color));
    saveLocalCart(cart);
    return { success: true, message: 'Item removed from cart' };
  }
};

// Update item quantity in cart
export const updateCartQuantity = async (axios, productId, size, color, newQuantity) => {
  if (newQuantity <= 0) {
    return await removeFromCart(axios, productId, size, color);
  }

  const token = localStorage.getItem('user-token');
  if (token) {
    try {
    const response = await axios.put(`/api/cart/update/${productId}`, {
      quantity: newQuantity,
      size,
      color
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    // Dispatch custom event to notify cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    return { 
      success: true,
      message: response.data.message,
      cart: response.data.cart 
    };
    } catch (error) {
      console.error('Error updating cart quantity (backend):', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update quantity' 
      };
    }
  } else {
    const cart = getLocalCart();
    const itemIndex = cart.findIndex(item => item.productId === productId && item.size === size && item.color === color);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = newQuantity;
      saveLocalCart(cart);
      return { success: true, message: 'Quantity updated', cart: cart };
    }
    return { success: false, message: 'Item not in cart' };
  }
};

// Clear entire cart
export const clearCart = async (axios) => {
  const token = localStorage.getItem('user-token');
  if (token) {
    try {
    const response = await axios.delete('/api/cart/clear', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Dispatch custom event to notify cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    return { 
      success: true,
      message: response.data.message 
    };
    } catch (error) {
      console.error('Error clearing cart (backend):', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  } else {
    saveLocalCart([]);
    return { success: true, message: 'Cart cleared' };
  } 
};

// Get cart total
export const getCartTotal = (cart) => {
  if (!cart || !Array.isArray(cart)) return 0;
  return cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Get cart item count
export const getCartItemCount = (cart) => {
  if (!cart || !Array.isArray(cart)) return 0;
  return cart.length;
};

// Check if item is in cart
export const isItemInCart = (cart, productId, size, color) => {
  if (!cart || !Array.isArray(cart)) return false;
  return cart.some(
    item => 
      (item.product?._id || item.productId) === productId && 
      item.size === size && 
      item.color === color
  );
};

// Sync local cart to backend when user logs in
export const syncLocalCartToBackend = async (axios) => {
  const localCart = getLocalCart();
  const token = localStorage.getItem('user-token');

  // Only proceed if user is logged in and there are items in the local cart
  if (token && localCart.length > 0) {
    console.log('Attempting to sync local cart to backend...');
    const syncPromises = localCart.map(async (item) => {
      try {
        // Re-use addToCart logic, which handles backend addition if token is present
        // The `product` argument for addToCart should be `item.product` (which contains _id, name, images)
        // The `variant` argument for addToCart should be `item` itself (as it contains size, color, price)
        // The `quantity` argument for addToCart should be `item.quantity`
        const result = await addToCart(axios, item.product, item, item.quantity);
        if (!result.success) {
          console.error(`Failed to sync item ${item.productId} to backend: ${result.message}`);
        }
        return result;
      } catch (error) {
        console.error(`Error syncing item ${item.productId} to backend:`, error);
        return { success: false, message: error.message };
      }
    });

    await Promise.all(syncPromises); // Wait for all items to attempt syncing

    // Clear local cart after attempting to sync all items
    localStorage.removeItem('local-cart');
    console.log('Local cart sync process completed and local cart cleared.');

    // Dispatch event to update UI after sync
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }
};
