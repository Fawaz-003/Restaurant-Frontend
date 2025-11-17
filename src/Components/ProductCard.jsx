import { useState } from "react";
import { Heart, IndianRupee, Star, Loader2, Truck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

// Function to calculate expected delivery date (7 days from today)
const getExpectedDeliveryDate = () => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 7);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[deliveryDate.getDay()];
  const date = deliveryDate.getDate();
  const month = months[deliveryDate.getMonth()];
  const year = deliveryDate.getFullYear();
  
  return {
    day: dayName,
    date: date,
    month: month,
    year: year,
    fullDate: `${dayName}, ${date} ${month} ${year}`
  };
};

const ProductCard = ({ product }) => {
  const { wishlist, addToWishlist, removeFromWishlist, user } = useAppContext();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const isWishlisted = wishlist.includes(product._id);

const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate("/login");
      return;
    }

    // This part only runs if the user is logged in.
    if (isUpdating) return; // Prevent multiple clicks
    setIsUpdating(true);

    const toastOptions = {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true, // Keep hideProgressBar for a cleaner look
      // Removed custom style to allow react-toastify to handle positioning
    };

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        toast.info("Removed from wishlist", toastOptions);
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist!", toastOptions);
      }
    } catch (error) {
      toast.error("Something went wrong.", toastOptions);
      console.error("Wishlist update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };


  const averageRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  const renderStars = (rating) => {
    const getRatingColorClass = (rating) => {
      if (rating >= 4) return "text-green-600 bg-green-100";
      if (rating >= 3) return "text-yellow-600 bg-yellow-100";
      if (rating >= 2) return "text-orange-600 bg-orange-100";
      return "text-red-600 bg-red-100";
    };

    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const getRatingColorClass = (rating) => {
    if (rating >= 4) return "bg-green-600";
    if (rating >= 3) return "bg-yellow-500";
    if (rating >= 2) return "bg-orange-500";
    return "bg-red-600";
  };

  const price = product.variant?.[0]?.price;
  const originalPrice = product.variant?.[0]?.originalPrice;
  const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link
      to={`/products/${product._id}`}
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 group border border-transparent hover:border-blue-300 flex flex-col"
    >
      <div className="relative bg-gray-50 h-40 sm:h-48 md:h-52 rounded-t-lg overflow-hidden flex-shrink-0">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">{discount}% off</div>
        )}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white hover:cursor-pointer rounded-full shadow-md hover:shadow-lg transition-all duration-200 z-10"
        >
          {isUpdating ? (
            <Loader2
              size={16}
              className="sm:w-[18px] sm:h-[18px] text-gray-400 animate-spin"
            />
          ) : (
            <Heart
              size={16}
              className={`sm:w-[18px] sm:h-[18px] ${
                isWishlisted
                  ? "text-red-500 fill-current"
                  : "text-gray-400 hover:text-red-400"
              } transition-colors duration-200`}
            />
          )}
        </button>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <p className="text-[11px] sm:text-xs text-gray-500 mb-1">{product.brand || 'Brand'}</p>
        <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 leading-snug flex-grow">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-2">
          {averageRating > 0 && (
            <div className={`flex items-center gap-1 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-sm ${getRatingColorClass(averageRating)}`}>
              <span>{averageRating.toFixed(1)}</span>
              <Star size={12} className="fill-current" />
            </div>
          )}
          <span className="text-xs text-gray-500">
            ({product.reviews?.length || 0} Ratings)
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="flex items-center text-base sm:text-lg font-bold text-gray-900">
            <IndianRupee width={14} height={14} className="mr-0.5" />
            {price}
          </span>
          {originalPrice && <span className="text-xs sm:text-sm text-gray-400 line-through">₹{originalPrice}</span>}
        </div>

        {/* Expected Delivery */}
        <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600">
          <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="font-medium">Expected Delivery:</span>
          <span>{getExpectedDeliveryDate().fullDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
