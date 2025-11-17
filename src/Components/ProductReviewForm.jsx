import React, { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { useAppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";

const ProductReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { axios, user } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`/api/products/${productId}/add/review`, {
        rating,
        comment,
        userId: user._id,
      });
      toast.success("Thank you for your review!");
      onReviewSubmit(); // This will refetch product data and close the form
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit your review."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Write Your Review
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <Star
                  key={starValue}
                  size={24}
                  className={`cursor-pointer transition-colors ${
                    starValue <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts about the product..."
          ></textarea>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={16} />}
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ProductReviewForm;