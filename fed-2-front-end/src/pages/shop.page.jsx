import { useMemo } from "react";
import {
  useGetProductsQuery,
  useGetAllCategoriesQuery,
  useGetAllColorsQuery,
} from "@/lib/api";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductSearchForm from "@/components/ProductSearchForm";

// Function to convert a string to a url friendly format
const toSlug = (s = "") => s.toLowerCase().trim().replace(/\s+/g, "-");

function ShopPage() {
  const { category: categorySlug } = useParams(); // read category from path
  const [searchParams, setSearchParams] = useSearchParams(); // read query params

  const colorSlug = searchParams.get("color"); // read color from query
  const sortUi = searchParams.get("sort"); // read sort from query

  const { data: categories } = useGetAllCategoriesQuery();
  const { data: colors } = useGetAllColorsQuery();

  // Convert UI sort option to API format
  const sortApi = useMemo(() => {
    if (sortUi === "price-asc") return "price_asc";
    if (sortUi === "price-desc") return "price_desc";
    return undefined;
  }, [sortUi]);

  // Build params for send to backend
  const params = useMemo(
    () => ({
      ...(categorySlug ? { categoryName: categorySlug } : {}),
      ...(colorSlug ? { colorName: colorSlug } : {}),
      ...(sortApi ? { sort: sortApi } : {}),
    }),
    [categorySlug, colorSlug, sortApi]
  );

  // Call the API to get products based on the params
  const { data: products = [], isLoading, isError } = useGetProductsQuery(params);

  // Handlers for color and sort changes
  const onChangeColor = (e) => {
    const val = e.target.value;
    if (!val) searchParams.delete("color");
    else searchParams.set("color", val);
    setSearchParams(searchParams, { replace: true });
  };

  const onChangeSort = (e) => {
    const val = e.target.value;
    if (!val) searchParams.delete("sort");
    else searchParams.set("sort", val);
    setSearchParams(searchParams, { replace: true });
  };

  // Shows “Loading…” while waiting for the server to return products. - Replace with a spinner
  if (isLoading) return <p>Loading…</p>;
  // If there was an error, show an error message
  if (isError) return <p>Something went wrong.</p>;

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-4xl font-bold">Shop</h2>

        <div className="flex items-center gap-3">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Link
              to="/shop"
              className={`px-3 py-1 rounded-full border ${!categorySlug ? "bg-black text-white" : ""}`}
            >
              All
            </Link>
            {categories?.map((c) => {
              const slug = toSlug(c.name);
              return (
                <Link
                  key={c._id}
                  to={`/shop/${slug}${window.location.search || ""}`}
                  className={`px-3 py-1 rounded-full border ${categorySlug === slug ? "bg-black text-white" : ""}`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>

          {/* Color filter (query-based) */}
          <select value={colorSlug || ""} onChange={onChangeColor} className="border rounded px-3 py-2">
            <option value="">All colors</option>
            {colors?.map((col) => (
              <option key={col._id} value={toSlug(col.name)}>
                {col.name}
              </option>
            ))}
          </select>

          {/* Sort (query-based) */}
          <select value={sortUi || ""} onChange={onChangeSort} className="border rounded px-3 py-2">
            <option value="">Sort</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6 gap-4">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/shop/products/${p._id}`}
            className="border rounded-lg p-3 block hover:shadow-sm transition-shadow"
            aria-label={`View details for ${p.name}`}
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-full aspect-square object-cover rounded-md"
              />
            )}
            <div className="mt-3">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm opacity-70">${p.price}</p>
            </div>
          </Link>
        ))}
        {!products.length && <p>No products found.</p>}
      </div>
    </main>
  );
}

export default ShopPage;
