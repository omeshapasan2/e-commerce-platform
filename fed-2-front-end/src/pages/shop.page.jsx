import {
  useGetAllProductsQuery,
  useGetAllCategoriesQuery,
} from "@/lib/api";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import CategoryButton from "@/components/CategoryButton";
import SimpleProductCard from "@/components/SimpleProductCard";

const COLORS = [
  { _id: "red", name: "Red" },
  { _id: "blue", name: "Blue" },
  { _id: "green", name: "Green" },
];

function ShopPage() {
  const params = useParams();
  const categorySlug = params.category ?? "all";
  const [searchParams, setSearchParams] = useSearchParams();
  const color = searchParams.get("color") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
  } = useGetAllCategoriesQuery();

  const selectedCategory = categories?.find(
    (c) => c.slug === categorySlug
  );
  const selectedCategoryId = selectedCategory?._id;

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetAllProductsQuery({
    categoryId:
      selectedCategoryId && selectedCategoryId !== "ALL"
        ? selectedCategoryId
        : undefined,
    colorId: color || undefined,
    sort: sort || undefined,
  });

  const handleCategoryChange = (slug) => {
    const queryParams = new URLSearchParams();
    if (color) queryParams.set("color", color);
    if (sort) queryParams.set("sort", sort);
    const query = queryParams.toString();
    if (slug === "all") {
      navigate(`/shop${query ? `?${query}` : ""}`);
    } else {
      navigate(`/shop/${slug}${query ? `?${query}` : ""}`);
    }
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    const queryParams = new URLSearchParams();
    if (value) queryParams.set("color", value);
    if (sort) queryParams.set("sort", sort);
    setSearchParams(queryParams);
  };

  const handleSortChange = (value) => {
    const queryParams = new URLSearchParams();
    if (color) queryParams.set("color", color);
    if (value) queryParams.set("sort", value);
    setSearchParams(queryParams);
  };

  if (isLoading || isCategoriesLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <h2 className="text-4xl font-bold">Shop</h2>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-x-4 max-w-full overflow-x-auto pb-2">
          {categories?.map((category) => (
            <CategoryButton
              key={category._id}
              category={category}
              onClick={() => handleCategoryChange(category.slug)}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={color}
            onChange={handleColorChange}
            className="border rounded px-2 py-1"
          >
            <option value="">All Colors</option>
            {COLORS.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSortChange("asc")}
              className={`border rounded px-4 py-2 transition-colors ${
                sort === "asc" ? "bg-black text-white" : "bg-white"
              }`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => handleSortChange("desc")}
              className={`border rounded px-4 py-2 transition-colors ${
                sort === "desc" ? "bg-black text-white" : "bg-white"
              }`}
            >
              Price: High to Low
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-4 md:gap-y-8">
          {products?.map((product) => (
            <SimpleProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default ShopPage;
