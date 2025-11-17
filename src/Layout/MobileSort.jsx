import { useState, useRef, useEffect } from "react";


const MobileSort = ({ sortBy, setSortBy }) => {
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);

  const options = [
    { label: "Sort", value: "name" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Highest Rated", value: "rating" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={sortRef} className="lg:hidden sm:hidden h-3 w-50 flex relative mb-4 px-1">
      {/* Link-like Sort */}
      <span
        className="flex items-center cursor-pointer text-gray-700 hover:text-blue-600"
        onClick={() => setShowSort((s) => !s)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h18M3 12h12M3 20h6"
          />
        </svg>
        <span className="ml-1 text-sm font-medium truncate">
          {options.find((opt) => opt.value === sortBy)?.label || "Sort"}
        </span>
      </span>

      {/* Dropdown */}
      {showSort && (
        <div className="absolute top-full right-0 mt-1 min-w-[100px] bg-white border rounded-2xl shadow-lg z-60">
          {options.map((opt) => (
            <span
              key={opt.value}
              className={`block px-4 py-2 cursor-pointer rounded-2xl text-gray-700 hover:bg-blue-100 ${
                sortBy === opt.value ? "font-semibold bg-blue-50" : ""
              }`}
              onClick={() => {
                setSortBy(opt.value);
                setShowSort(false);
              }}
            >
              {opt.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSort;
