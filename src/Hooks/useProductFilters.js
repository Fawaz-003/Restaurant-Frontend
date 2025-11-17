import { useState, useMemo } from "react";

export const useProductFilters = (allProducts) => {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const priceRanges = [
    { label: "Under ₹1000", min: 0, max: 999.99 },
    { label: "₹1000 to ₹5000", min: 1000, max: 5000 },
    { label: "₹5000 to ₹10000", min: 5000, max: 10000 },
    { label: "₹10000 to ₹20000", min: 10000, max: 20000 },
    { label: "Over ₹20000", min: 20000, max: Infinity },
  ];

  const categories = [...new Set(allProducts.map((p) => p.categoryName))].filter(Boolean);
  const brands = [...new Set(allProducts.map((p) => p.brand))];

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const productPrice = product.variant?.[0]?.price || 0;

      // Price filter
      if (selectedPriceRanges.length > 0) {
        const inRange = selectedPriceRanges.some(
          (range) => productPrice >= range.min && productPrice <= range.max
        );
        if (!inRange) return false;
      }

      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.categoryName)
      )
        return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand))
        return false;

      // Stock filter
      if (showInStockOnly && !(product.variant?.some(v => v.quantity > 0))) return false;

      // Rating filter
      if ((product.reviews?.reduce((acc, r) => acc + r.rating, 0) / product.reviews?.length || 0) < minRating) return false;

      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.variant?.[0]?.price || 0) - (b.variant?.[0]?.price || 0);
        case "price-high":
          return (b.variant?.[0]?.price || 0) - (a.variant?.[0]?.price || 0);
        case "rating":
          return (b.reviews?.reduce((acc, r) => acc + r.rating, 0) / b.reviews?.length || 0) - (a.reviews?.reduce((acc, r) => acc + r.rating, 0) / a.reviews?.length || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, selectedPriceRanges, selectedCategories, selectedBrands, showInStockOnly, minRating, searchQuery, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const togglePriceRange = (range) => {
    setSelectedPriceRanges((prev) =>
      prev.some((r) => r.label === range.label)
        ? prev.filter((r) => r.label !== range.label)
        : [...prev, range]
    );
  };

  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setShowInStockOnly(false);
    setMinRating(0);
    setSearchQuery("");
  };

  return {
    filteredProducts,
    filters: { priceRanges, selectedPriceRanges, categories, selectedCategories, brands, selectedBrands, showInStockOnly, minRating, searchQuery, sortBy },
    filterSetters: { togglePriceRange, toggleCategory, toggleBrand, setShowInStockOnly, setMinRating, setSearchQuery, setSortBy },
    clearAllFilters
  };
};