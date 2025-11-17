import MobileFilter from "../Layout/MobileFilter";
import MobileSort from "../Layout/MobileSort";
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronRight } from "lucide-react";
import ProductCard from "../Components/ProductCard";
import ProductCardSkeleton from "../Layout/Skeleton/ProductCardSkeleton.jsx";
import { useProductFilters } from "../Hooks/useProductFilters.js";
import { useAppContext } from "../Context/AppContext";

const Collections = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const { axios, user } = useAppContext();

  const { filteredProducts, filters, filterSetters, clearAllFilters } = useProductFilters(allProducts);
  const { priceRanges, selectedPriceRanges, categories, selectedCategories, brands, selectedBrands, showInStockOnly, minRating, searchQuery, sortBy } = filters;
  const { togglePriceRange, toggleCategory, toggleBrand, setShowInStockOnly, setMinRating, setSearchQuery, setSortBy } = filterSetters;

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          axios.get("/api/products/list"),
          axios.get("/api/category/list"),
        ]);

        const productList = productRes.data.products || [];
        const categoryList = categoryRes.data.categories || [];

        const productsWithCategoryName = productList.map((product) => {
          const category = categoryList.find((c) => c._id === product.category);
          return {
            ...product,
            categoryName: category ? category.name : "Uncategorized",
          };
        });

        setAllProducts(productsWithCategoryName);
        setAvailableCategories(categoryList);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, [axios]);

  const openMobileFilter = () => {
    setIsMobileFilterOpen(true);
    setHideBottomNavForFilter(true);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
    setHideBottomNavForFilter(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:block w-80 bg-white p-6 overflow-y-auto border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Filter className="mr-2" size={20} /> Filters
          </h2>
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Range
          </label>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPriceRanges.some(r => r.label === range.label)}
                  onChange={() => togglePriceRange(range)}
                  className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 hover:text-gray-800">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Categories
          </label>
          <div className="space-y-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <label key={cat} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 hover:text-gray-800">
                    {cat}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No categories found</p>
            )}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Brands
          </label>
          <div className="space-y-2">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <label key={brand} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 hover:text-gray-800">
                    {brand}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No brands found</p>
            )}
          </div>
        </div>

        {/* Rating & In Stock */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Any Rating</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
              className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 hover:text-gray-800">
              In Stock Only
            </span>
          </label>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        {/* Mobile Filter & Sort Row */}
        <div className="lg:hidden h-10 w-30 absolute right-1 mb-4 px-4">
          {/* Sort Button on Left */}

          {/* Filter Button on Right */}
          <span
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer"
          >
            <Filter className="mr-2" size={16} /> Filter
          </span>
        </div>

        {/* Conditional Mobile Sort Options */}
        {showSort && <MobileSort sortBy={sortBy} setSortBy={setSortBy} />}

        {/* Sort Section */}
        <div className="mb-6 flex justify-between items-center">
          {/* Desktop Sort */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white w-auto"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} results
          </p>

          {/* ✅ Mobile Sort Component */}
          <div className="lg:hidden flex justify-between items-center mb-4 px-4"></div>
          <MobileSort sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {/* --- Product Grid --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4">
          {/* Loading State */}
          {loading && (
            [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-16 col-span-full">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any products matching your current filters. Try
              adjusting your search criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear All Filters <ChevronRight className="ml-2" size={16} />
            </button>
          </div>
        )}

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <MobileFilter
            priceRanges={priceRanges}
            selectedPriceRanges={selectedPriceRanges}
            togglePriceRange={togglePriceRange}
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            brands={brands}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            showInStockOnly={showInStockOnly}
            setShowInStockOnly={setShowInStockOnly}
            minRating={minRating}
            setMinRating={setMinRating}
            clearAllFilters={clearAllFilters}
            onClose={() => setIsMobileFilterOpen(close)}
          />
        )}

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Showing {filteredProducts.length} of {allProducts.length} products
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Collections;
