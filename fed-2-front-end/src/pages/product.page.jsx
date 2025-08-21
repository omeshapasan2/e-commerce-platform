import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { useGetProductByIdQuery, useCreateReviewMutation } from "@/lib/api";
import { Star, ShoppingCart, ArrowLeft, Package, Users, MessageCircle, Calendar } from "lucide-react";

function StarRating({ rating, showNumber = false, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? "fill-black text-black"
              : "fill-gray-300 text-gray-300"
          }`}
        />
      ))}
      {showNumber && <span className="ml-2 text-sm text-gray-600">({rating})</span>}
    </div>
  );
}

function ReviewForm({ onSubmit, isLoading }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !review.trim()) return;
    onSubmit({ review: review.trim(), rating: Number(rating) });
    setReview("");
    setRating("");
  };

  return (
    <div className="mt-8 bg-white rounded-lg border border-gray-300 p-6">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5" />
        Write a Review
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            placeholder="Share your thoughts about this product..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <select 
            value={rating} 
            onChange={(e) => setRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select a rating</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={String(n)}>
                {n} star{n !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !rating || !review.trim()}
          className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

function ReviewList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-lg border border-gray-300 p-12 text-center">
        <MessageCircle className="w-12 h-12 mb-4 opacity-30 mx-auto text-gray-600" />
        <h3 className="text-lg font-semibold mb-2 text-gray-700">No reviews yet</h3>
        <p className="text-sm text-gray-500">Be the first to share your experience with this product!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Customer Reviews
        </h3>
        <div className="flex items-center gap-3">
          <StarRating rating={Math.round(averageRating)} showNumber size="w-5 h-5" />
          <span className="text-sm text-gray-600">
            {averageRating.toFixed(1)} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg border border-gray-300 p-6 hover:border-gray-400 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {review.userImage ? (
                  <img
                    src={review.userImage}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-semibold text-lg">
                    {review.userName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      {review.createdAt && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.review}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Page ---
export default function ProductPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();

  // Fetch product from API (RTK Query)
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(productId);

  // Create review mutation
  const [createReview, { isLoading: isReviewLoading }] = useCreateReviewMutation();

  const onAddToCart = () => {
    if (!product) return;
    dispatch(addToCart(product));
  };

  const handleReviewSubmit = async (values) => {
    try {
      await createReview({ ...values, productId }).unwrap();
      // Refetch to show the new review right away
      refetch();
    } catch (error) {
      // replace this with a toast
      console.error("Failed to submit review", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="px-4 lg:px-16 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-white">
        <div className="px-4 lg:px-16 py-8">
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const averageRating = product.reviews?.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
    : 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 lg:px-16 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2">
          <Link to="/shop" className="hover:text-black transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Shop
          </Link>
          <span>/</span>
          <span className="font-medium">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="aspect-square relative group">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Only {product.stock} left!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              {product.reviews?.length > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <StarRating rating={Math.round(averageRating)} showNumber size="w-5 h-5" />
                  <span className="text-gray-600">
                    {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 border border-gray-300">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ${product.price}
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-gray-400" />
                <span className={`font-medium ${
                  product.stock > 10 ? 'text-gray-800' : 
                  product.stock > 0 ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <Link to="/shop" className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto">
          <ReviewList reviews={product.reviews} />
          <ReviewForm onSubmit={handleReviewSubmit} isLoading={isReviewLoading} />
        </div>
      </div>
    </main>
  );
}