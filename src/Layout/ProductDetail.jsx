import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import {
  IndianRupee,
  Star,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import ProductReviews from "./ProductReviews";
import Modal from "../Layout/Modal";
import AddReviewForm from "./AddReviewForm";
import { MessageSquarePlus } from "lucide-react";
import ProductDetailSkeleton from "./Skeleton/ProductDetailSkeleton.jsx";
import { addToCart as addToCartUtil } from "../utils/cartUtils";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [fetchProduct, setFetchProduct] = useState(null);
  const { axios, user, wishlist, addToWishlist, removeFromWishlist, navigate } =
    useAppContext();
  const [thumbnail, setThumbnail] = useState(null);

  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const isWishlisted = wishlist.includes(productId);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const userHasReviewed =
    user && fetchProduct?.reviews.some((review) => review.user?._id === user._id);

  useEffect(() => {
    fetchSingleProduct();
  }, [productId]);

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      const productData = response.data.product;
      setFetchProduct(productData);
      setThumbnail(productData?.images?.[0]?.url);
      if (productData?.variant?.length > 0) {
        const firstColor = productData.variant[0].color;
        const firstSize = productData.variant[0].size;
        setSelectedColor(firstColor);
        setSelectedSize(firstSize);
        setSelectedVariant(productData.variant[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (selectedColor && selectedSize && fetchProduct?.variant?.length) {
      const match = fetchProduct.variant.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(match || null);
    }
  }, [selectedColor, selectedSize, fetchProduct]);

  const handleWishlistClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isUpdatingWishlist) return;
    setIsUpdatingWishlist(true);

    const toastOptions = {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      style: { margin: "45px", zIndex: 9999 },
    };

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        toast.info("Removed from wishlist", toastOptions);
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist!", toastOptions);
      }
    } catch (error) {
      toast.error("Something went wrong.", toastOptions);
      console.error("Wishlist update failed:", error);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const handleShareClick = async () => {
    const shareData = {
      title: fetchProduct.name,
      text: `Check out this product: ${fetchProduct.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Could not share product.");
      console.error("Share failed:", error);
    }
  };

  const handleReviewAdded = () => {
    setIsReviewModalOpen(false);
    fetchSingleProduct(); // Refetch product to show the new review
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select size and color");
      return;
    }

    if (selectedVariant.quantity === 0) {
      toast.error("This variant is out of stock");
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCartUtil(axios, fetchProduct, selectedVariant, 1);
      
      if (result.success) {
        toast.success(result.message || "Added to cart successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error(result.message || "Failed to add to cart", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart", {
        position: "top-right",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      toast.error("Please select size and color");
      return;
    }

    if (selectedVariant.quantity === 0) {
      toast.error("This variant is out of stock");
      return;
    }

    // Add to cart and redirect to cart page
    setIsAddingToCart(true);
    try {
      const result = await addToCartUtil(axios, fetchProduct, selectedVariant, 1);
      
      if (result.success) {
        toast.success("Item added to cart", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/cart");
        }, 500);
      } else {
        toast.error(result.message || "Failed to add to cart", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart", {
        position: "top-right",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!fetchProduct) {
    return <ProductDetailSkeleton />;
  }

  const colors = [...new Set(fetchProduct.variant?.map((v) => v.color))];
  const sizes = [...new Set(fetchProduct.variant?.map((v) => v.size))];

  const averageRating =
    fetchProduct.reviews?.length > 0
      ? fetchProduct.reviews.reduce((acc, r) => acc + r.rating, 0) /
        fetchProduct.reviews.length
      : 0;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-7xl w-full px-4 py-4 sm:px-6 lg:px-8 bg-gray-50">
        <p>
          <span>Home</span> / <span> Products</span> /{" "}
          <span>{fetchProduct.subcategory}</span> /
          <span className="text-indigo-500"> {fetchProduct?.name}</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-4">
          <div className="md:sticky top-24 self-start">
            <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {fetchProduct.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image.url)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          </div>
          <div className="text-sm">
            <div className="flex justify-between items-start mb-5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-5 font-medium">{fetchProduct.name}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWishlistClick}
                  className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 z-10"
                  aria-label="Toggle Wishlist"
                >
                  {isUpdatingWishlist ? (
                    <Loader2 size={20} className="text-gray-400 animate-spin" />
                  ) : (
                    <Heart
                      size={20}
                      className={`${
                        isWishlisted
                          ? "text-red-500 fill-current"
                          : "text-gray-500 hover:text-red-400"
                      } transition-colors duration-200`}
                    />
                  )}
                </button>
                <button
                  onClick={handleShareClick}
                  className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 z-10"
                  aria-label="Share Product"
                >
                  <Share2 size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-xs text-gray-500 ml-1">
                ({fetchProduct.reviews?.length || 0})
              </span>
            </div>

            {selectedVariant && (
              <div className="mb-4">
                <p className="text-3xl font-semibold text-gray-900 flex items-center gap-1">
                  <IndianRupee />
                  {selectedVariant.price}
                </p>
              </div>
            )}

            <div className="mt-6">
              {colors.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">Color:</p>
                  <div className="flex gap-2">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          selectedColor === color
                            ? "border-black scale-110"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          const firstAvailableSize = fetchProduct.variant.find(
                            (v) => v.color === color
                          )?.size;

                          if (firstAvailableSize) {
                            setSelectedSize(firstAvailableSize);
                            setSelectedVariant(
                              fetchProduct.variant.find(
                                (v) =>
                                  v.color === color &&
                                  v.size === firstAvailableSize
                              )
                            );
                          }
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">Size:</p>
                  <div className="flex gap-2">
                    {sizes.map((size, index) => {
                      const isAvailable = fetchProduct.variant.some(
                        (v) => v.color === selectedColor && v.size === size
                      );

                      return (
                        <button
                          key={index}
                          disabled={!isAvailable}
                          className={`px-4 py-2 rounded-lg border transition 
              ${
                selectedSize === size && isAvailable
                  ? "bg-indigo-500 text-white border-indigo-600"
                  : isAvailable
                  ? "border-gray-300 hover:bg-gray-100"
                  : "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
                          onClick={() => isAvailable && setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedVariant && (
              <div className="mb-4">
                <p
                  className={`${
                    selectedVariant.quantity > 0
                      ? "text-blue-600"
                      : "text-red-500"
                  }`}
                >
                  {selectedVariant.quantity > 0
                    ? `Stocks lefted ${selectedVariant.quantity}`
                    : "Out of Stock"}
                </p>
              </div>
            )}
            <p className="text-base font-medium mt-6">About Product</p>
            <p className="text-gray-600">{fetchProduct.description}</p>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button 
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.quantity === 0 || isAddingToCart}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={!selectedVariant || selectedVariant.quantity === 0 || isAddingToCart}
                className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? 'Adding...' : 'Buy now'}
              </button>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 py-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Customer Reviews
                </h2>
                {user && !userHasReviewed && (
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageSquarePlus size={18} /> Rate Product
                  </button>
                )}
              </div>
              <ProductReviews
                reviews={fetchProduct.reviews}
                averageRating={averageRating}
              />
            </div>
          </div>
        </div>
        {/* Add Review Modal */}
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="Write a Review"
        >
          <AddReviewForm productId={productId} onReviewSubmit={handleReviewAdded} />
        </Modal>
      </div>
    </div>
  );
};

export default ProductDetail;
