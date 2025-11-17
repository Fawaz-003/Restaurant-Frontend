import { useEffect, useState } from "react";
import ProductCard from "../../../../Components/ProductCard.jsx";
import { useAppContext } from "../../../../Context/AppContext.jsx";
import ProductCardSkeleton from "../../../../Layout/Skeleton/ProductCardSkeleton.jsx";
import { Heart, ShoppingBag } from "lucide-react";

const UserWishlist = () => {
  const { axios, user, wishlist, removeFromWishlist } = useAppContext();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If a product is removed from the global wishlist, filter it from the local state
    if (wishlist.length < wishlistProducts.length) {
      setWishlistProducts((prev) => prev.filter((p) => wishlist.includes(p._id)));
      return;
    }

    const fetchWishlistProducts = async () => {
      if (!user?._id || wishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      const startTime = Date.now();
      try {
        setLoading(true);
        // Fetch actual product details for each ID in the global wishlist
        const productRes = await axios.post("/api/products/bulk", { ids: wishlist });
        setWishlistProducts(productRes.data.products);
      } catch (err) {
        setError("Failed to load wishlist products");
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 700; // 0.7 seconds

        if (elapsedTime < minDisplayTime) {
          setTimeout(() => {
            setLoading(false);
          }, minDisplayTime - elapsedTime);
        } else {
          setLoading(false);
        }
      }
    };

    fetchWishlistProducts();
  }, [axios, user, wishlist, wishlistProducts.length]);

  if (loading) {
    return (
      <>
        {/* Skeleton for the title */}
        <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
        
        {/* Skeleton for the product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
          {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </>
    );
  }
  if (error) return <p className="text-center py-16 text-red-600">{error}</p>;
  if (wishlist.length === 0 || wishlistProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your Wishlist is Empty
        </h3>
        <p className="text-gray-600 mb-4">
          Looks like you haven’t added anything to your wishlist yet.
        </p>
        <button
          onClick={() => (window.location.href = "/collections")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto w-fit"
        >
          <ShoppingBag size={18} /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-medium">Favourite Products</h1>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {wishlistProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
    </div>
  );
};

export default UserWishlist;
