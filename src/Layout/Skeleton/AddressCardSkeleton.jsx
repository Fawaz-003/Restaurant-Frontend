const AddressCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        {/* Name and Label */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>

      {/* Address lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
};

export default AddressCardSkeleton;