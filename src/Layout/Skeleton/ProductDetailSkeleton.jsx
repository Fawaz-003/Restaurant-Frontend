import React from "react";

const ProductDetailSkeleton = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-7xl w-full px-6 py-2 lg:px-20 lg:py-8 bg-white">
        <div className="animate-pulse">
          {/* Breadcrumbs skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-4">
            {/* Image section skeleton */}
            <div className="md:sticky top-24 self-start">
              <div className="flex gap-3">
                {/* Small thumbnails skeleton */}
                <div className="flex flex-col gap-3">
                  <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                  <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                  <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
                </div>
                {/* Main image skeleton */}
                <div className="flex-1 h-[350px] sm:h-[450px] bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Details section skeleton */}
            <div className="space-y-6">
              {/* Product name skeleton */}
              <div className="h-10 bg-gray-300 rounded w-3/4"></div>

              {/* Rating skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-28 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>

              {/* Price skeleton */}
              <div className="h-8 w-1/4 bg-gray-300 rounded"></div>

              {/* Color options skeleton */}
              <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Size options skeleton */}
              <div className="space-y-3">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="w-16 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>

              {/* Description skeleton */}
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Buttons skeleton */}
              <div className="flex items-center gap-4 pt-6">
                <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;