import ProductCard from "../../Components/ProductCard";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton.jsx";

const LatestCollections = () => {
  const [products, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { axios } = useAppContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products/list"); // adjust endpoint
        const list = res.data.products; // depends on your API response
        
        setAllProducts(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axios]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header Section - Responsive Typography and Spacing */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
            <div className="h-[1px] sm:h-[1.2px] bg-gray-300 flex-1 max-w-[50px] sm:max-w-none"></div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 tracking-wide sm:tracking-wider px-2">
              LATEST COLLECTIONS
            </h1>
            <div className="h-[1px] sm:h-[1.2px] bg-gray-300 flex-1 max-w-[50px] sm:max-w-none"></div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4">
            Discover our latest dress collections, blending elegance and modern
            style. Perfectly crafted to keep you trendy, stylish, and
            comfortable always
          </p>
        </div>

        {/* Products Container - Responsive Layout */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-lg">
          {/* Header with responsive padding and button */}
          <div className="flex items-center justify-between p-4 sm:p-6 lg:p-5 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
              Featured Products
            </h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-2.5 lg:p-2 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md">
              <ChevronRight size={16} className="sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Products Grid - Comprehensive Responsive Grid */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {/* Loading State */}
              {loading && (
                [...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)
              )}

              {!loading && error && (
                <div className="text-center py-16">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {!loading && !error && products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestCollections;
