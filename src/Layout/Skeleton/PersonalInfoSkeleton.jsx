const PersonalInfoSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="p-2">
        <div className="flex items-center justify-between">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          {/* Button Skeleton */}
          <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Photo Skeleton */}
          <div className="md:col-span-2 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>

        {/* Stats and Wallet Skeleton */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Stats Skeleton */}
          <div className="bg-gray-100 p-4 rounded-lg space-y-3">
            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>

          {/* Wallet Skeleton */}
          <div className="bg-gray-100 p-4 rounded-lg space-y-3">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSkeleton;