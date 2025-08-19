import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProductByIdQuery } from "@/lib/api";
import { addToCart } from "@/lib/features/cartSlice";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function ProductPage() {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId);
  const dispatch = useDispatch();

  const onAddToCart = () => {
    if (!product) return;
    dispatch(addToCart(product));
  };

  if (isLoading) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Spinner variant="ellipsis" size={32} />
        </div>
      </main>
    );
  }

  if (isError || !product) return <main className="px-4 lg:px-16 py-8">Product not found.</main>;

  return (
    <main className="px-4 lg:px-16 py-8">
      <nav className="text-sm opacity-70 mb-4">
        <Link to="/shop" className="underline">Shop</Link> / <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-3">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full object-cover rounded-md" style={{ aspectRatio: "1/1" }} />
          ) : (
            <div className="w-full aspect-square bg-gray-100 rounded-md grid place-items-center">No image</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.description && <p className="mt-3 text-base opacity-80">{product.description}</p>}
          <div className="mt-4 text-2xl font-semibold">${product.price}</div>

          <div className="mt-6 flex gap-3">
            <button onClick={onAddToCart} className="px-5 py-3 rounded-lg bg-black text-white">Add to Cart</button>
            <Link to="/shop" className="px-5 py-3 rounded-lg border">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}