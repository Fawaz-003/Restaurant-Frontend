const UserReviewSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md"></div>

      <div className="flex-1 space-y-3">
        {/* Product Name Skeleton */}
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>

        {/* Rating Skeleton */}
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>

        {/* Comment Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default UserReviewSkeleton;