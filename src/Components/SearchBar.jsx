import { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'wireless headphones',
    'running shoes',
    'laptop bag'
  ]);

  // Mock product suggestions based on search term
  const getProductSuggestions = (term) => {
    const allProducts = [
      { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', price: '$999', image: '📱' },
      { id: 2, name: 'Nike Air Max', category: 'Shoes', price: '$150', image: '👟' },
      { id: 3, name: 'MacBook Pro', category: 'Electronics', price: '$1,999', image: '💻' },
      { id: 4, name: 'Sony WH-1000XM4', category: 'Electronics', price: '$350', image: '🎧' },
      { id: 5, name: 'Adidas Ultraboost', category: 'Shoes', price: '$180', image: '👟' },
      { id: 6, name: 'iPad Pro', category: 'Electronics', price: '$799', image: '📱' },
      { id: 7, name: 'Samsung Galaxy S24', category: 'Electronics', price: '$899', image: '📱' },
      { id: 8, name: 'AirPods Pro', category: 'Electronics', price: '$249', image: '🎧' }
    ];

    if (!term) return [];
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5);
  };

  const getSearchSuggestions = (term) => {
    const suggestions = [
      'iphone 15',
      'macbook pro',
      'airpods',
      'nike shoes',
      'samsung galaxy',
      'wireless headphones',
      'running shoes',
      'laptop bag',
      'phone case',
      'bluetooth speaker'
    ];

    if (!term) return [];
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(term.toLowerCase()) && 
      suggestion.toLowerCase() !== term.toLowerCase()
    ).slice(0, 4);
  };

  const trendingSearches = [
    'iPhone 15 Pro',
    'Black Friday deals',
    'Winter jackets',
    'Gaming laptop',
    'Smartwatch'
  ];

  const productSuggestions = getProductSuggestions(searchTerm);
  const searchSuggestions = getSearchSuggestions(searchTerm);

  const handleSearch = (term) => {
    if (term.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(term)) {
        setRecentSearches(prev => [term, ...prev.slice(0, 4)]);
      }
      setSearchTerm(term);
      setIsOpen(false);
      console.log('Searching for:', term);
    }
  };

  const removeRecentSearch = (searchToRemove, e) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-2xl mx-auto relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-4 py-3 my-5 bg-white text-m border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 max-h-[70vh] sm:max-h-96 overflow-y-auto">
            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Search Suggestions</h3>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Search className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Product Suggestions */}
            {productSuggestions.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Products</h3>
                {productSuggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSearch(product.name)}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="text-2xl mr-3">{product.image}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category} • {product.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!searchTerm && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Recent Searches</h3>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{search}</span>
                    </div>
                    <button
                      onClick={(e) => removeRecentSearch(search, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all duration-150"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {!searchTerm && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Trending</h3>
                {trendingSearches.map((trend, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(trend)}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TrendingUp className="h-4 w-4 text-red-400 mr-3" />
                    <span className="text-gray-700">{trend}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchTerm && searchSuggestions.length === 0 && productSuggestions.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">🔍</div>
                <p className="text-gray-500">No suggestions found for "{searchTerm}"</p>
                <button
                  onClick={() => handleSearch(searchTerm)}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Search anyway
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;