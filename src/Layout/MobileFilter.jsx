import React from "react";
import { X } from "lucide-react";

const MobileFilter = ({
  priceRanges,
  selectedPriceRanges, togglePriceRange,
  categories, selectedCategories, toggleCategory,
  brands, selectedBrands, toggleBrand,
  showInStockOnly, setShowInStockOnly,
  minRating, setMinRating,
  clearAllFilters, onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="ml-auto w-full max-w-sm bg-white shadow-2xl h-full flex flex-col z-50 animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Price */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.some(
                      (r) => r.label === range.label
                    )}
                    onChange={() => togglePriceRange(range)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr />

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div className="space-y-2">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No categories found</p>
              )}
            </div>
          </div>

          <hr />

          {/* Brands */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Brands</h3>
            <div className="space-y-2">
              {brands.length > 0 ? (
                brands.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{b}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No brands found</p>
              )}
            </div>
          </div>

          <hr />

          {/* Rating */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3★ & above</option>
              <option value={4}>4★ & above</option>
              <option value={4.5}>4.5★ & above</option>
            </select>
          </div>

          <hr />

          {/* In Stock */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t bg-white flex gap-3 shadow-lg">
            <button
            onClick={clearAllFilters}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
            >
            Clear All
            </button>
            <button
            onClick={onClose}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
            Apply
            </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilter;
