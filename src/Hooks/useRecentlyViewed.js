import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../Context/AppContext';

const MAX_RECENTLY_VIEWED = 20; // Match backend limit

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { axios, user } = useAppContext();

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (!user) {
        setRecentlyViewed([]);
        return;
      }
      try {
        const res = await axios.get('/api/recent-views/');
        // The backend returns objects with a `product` property.
        const products = res.data.map(item => item.product).filter(Boolean);
        setRecentlyViewed(products);
      } catch (error) {
        console.error('Failed to fetch recently viewed items', error);
        setRecentlyViewed([]);
      }
    };

    fetchRecentlyViewed();
  }, [user, axios]);

  const addProductToRecentlyViewed = useCallback((product) => {
    if (!user || !product || !product._id) return;

    // Optimistically update UI
    setRecentlyViewed(prevItems => {
      const filteredItems = prevItems.filter(item => item._id !== product._id);
      const newItems = [product, ...filteredItems];
      return newItems.slice(0, MAX_RECENTLY_VIEWED);
    });

    // Send to backend
    const addToBackend = async () => {
      try {
        await axios.post('/api/recent-views/add', { productId: product._id });
      } catch (error) {
        console.error('Failed to save recently viewed item to backend', error);
        // Optional: Revert optimistic update on failure
        // For this use case, it's low-impact, so we can leave it.
      }
    };
    
    // Fire and forget
    addToBackend();
  }, [axios, user]);

  return { recentlyViewed, addProductToRecentlyViewed };
};