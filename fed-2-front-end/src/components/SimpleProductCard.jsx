import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

function SimpleProductCard({ product }) {
  const dispatch = useDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    );

    // Reset animation after a short delay
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 600);
  };

  return (
    <Link
      to={`/shop/products/${product._id}`}
      className="group bg-white border border-gray-200 rounded-xl p-4 block hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-in-out hover:-translate-y-1"
      aria-label={`View details for ${product.name}`}
    >
      {/* Product Image */}
      <div className="h-64 sm:h-72 md:h-80 lg:h-96 mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-2xl w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      {/* Product Details */}
      <div className="space-y-2 mb-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
          ${product.price?.toFixed?.(2) ?? product.price}
        </p>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-auto">
        <Button
          className={`w-full transition-all duration-300 ease-in-out transform ${
            isAddingToCart
              ? "bg-gray-500 hover:bg-gray-600 scale-95"
              : "bg-black hover:bg-gray-800 hover:scale-105 active:scale-95"
          }`}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${
            isAddingToCart ? "opacity-0" : "opacity-100"
          }`}>
            Add to Cart
          </span>
          
          {/* Success Animation */}
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isAddingToCart ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </Button>
      </div>
    </Link>
  );
}

export default SimpleProductCard;