import React from 'react';

const CartSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section Skeleton */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="h-6 bg-gray-300 rounded w-40"></div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
              </div>

              {/* Cart Item Skeletons */}
              {[...Array(2)].map((_, index) => (
                <div key={index} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 rounded-lg bg-gray-200 flex-shrink-0"></div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="h-5 bg-gray-200 rounded w-20"></div>
                          <div className="h-5 bg-gray-200 rounded w-20"></div>
                          <div className="h-5 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button Skeleton */}
            <div className="mt-6 h-10 bg-gray-200 rounded w-48"></div>
          </div>

          {/* Order Summary Section Skeleton */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <div className="p-6">
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>

                {/* Delivery Address */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-200 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
