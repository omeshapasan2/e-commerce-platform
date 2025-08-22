import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

function SimpleProductCard({ product }) {
  const dispatch = useDispatch();

  return (
      <Link
        to={`/shop/products/${product._id}`}
        className="border rounded-lg p-3 block hover:shadow-sm transition-shadow"
        aria-label={`View details for ${product.name}`}
      >
        {/* Product Image and Details */}
        <div className="h-64 sm:h-72 md:h-80 lg:h-96">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-2xl w-full h-full object-cover"
          />
        </div>
        <div className="mt-2">
          <span className="text-lg sm:text-xl md:text-2xl block">
            {product.name}
          </span>
          <span className="text-base sm:text-lg md:text-xl block">
            ${product.price}
          </span>
        </div>

        <div>
          <Button
            className={"w-full mt-2"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(
                addToCart({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              );
            }}
          >
            Add To Cart
          </Button>
        </div>
      </Link>
    
  );
}

export default SimpleProductCard;
