import React from "react";
import { Star, CheckCircle } from "lucide-react";

const ProductReviewsSkeleton = () => {
  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={16} className="text-gray-300" />
    ));
  };

  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
      </div>

      {/* --- Ratings Summary Skeleton --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-lg">
          <div className="h-12 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="flex my-2">{renderStars()}</div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 bg-gray-300 rounded w-12"></div>
              <div className="w-full bg-gray-300 rounded-full h-2.5"></div>
              <div className="h-4 bg-gray-300 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Individual Reviews Skeleton --- */}
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-300 rounded w-28"></div>
                  <div className="h-5 bg-gray-300 rounded-full w-32"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-1/5"></div>
              </div>
              <div className="flex">{renderStars()}</div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviewsSkeleton;