const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col animate-pulse">
 
      <div className="bg-gray-200 h-40 sm:h-48 md:h-52 rounded-t-lg"></div>


      <div className="p-3 flex flex-col flex-grow">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5 mb-3"></div>

        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>

        <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;