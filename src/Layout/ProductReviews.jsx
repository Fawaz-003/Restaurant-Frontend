import React from "react";
import { Star, User, CheckCircle, ThumbsUp, Flag } from "lucide-react";

const ProductReviews = ({ reviews, averageRating }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-12 py-8 text-center border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h2>
        <p className="text-gray-500">No reviews yet for this product.</p>
      </div>
    );
  }

  const totalReviews = reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const renderStars = (rating, size = 16) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        className={`${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getRatingColorClass = (rating) => {
    return "text-gray-800"
  };

  const getRatingBarColorClass = (star) => {
    if (star === 5) return "bg-green-800";
    if (star === 4) return "bg-green-800";
    if (star === 3) return "bg-green-800";
    if (star === 2) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-12 py-8 border-t border-gray-200">
      {/* --- Ratings Summary --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg">
          <p
            className={`text-5xl font-bold ${getRatingColorClass(averageRating)}`}
          >
            {averageRating.toFixed(1)}
          </p>
          <div className="flex my-2">{renderStars(averageRating, 20)}</div>
          <p className="text-gray-600">Based on {totalReviews} reviews</p>
        </div>
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-4">
              <p className="text-sm font-medium text-gray-600 flex items-center">
                {star} <Star size={14} className="ml-1 text-black" />
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`${getRatingBarColorClass(
                    star
                  )} h-1.5 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-600 w-12 text-right">
                {count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Individual Reviews --- */}
      <div className="space-y-8">
        {reviews.map((review, index) => (
          <div key={review._id} className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 pb-6 last:border-b-0">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {review.userId?.avatar ? (
                <img
                  src={review.userId.avatar}
                  alt={review.userId.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xl font-bold text-gray-500">
                  {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : <User size={24} />}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">
                    {review.userId?.name || "Anonymous"}
                  </p>
                  {/* Placeholder for Verified Purchase badge */}
                  {index % 2 === 0 && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      <CheckCircle size={12} /> Verified Purchase
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex mb-2">{renderStars(review.rating)}</div>
              <p className="text-gray-700 leading-relaxed text-base">
                {review.comment}
              </p>
              {/* --- Review Actions (Helpful/Report) --- */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <ThumbsUp size={14} />
                  Helpful
                </button>
                <span className="text-gray-300">|</span>
                <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                  <Flag size={14} />
                  Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;