import CreateProductForm from "../components/CreateProductForm";
import { useGetAllCategoriesQuery, useGetAllColorsQuery } from "../lib/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

function CreateProductPage() {
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetAllCategoriesQuery();
  const {
    data: colors,
    isLoading: colorsLoading,
    isError: colorsError,
  } = useGetAllColorsQuery();

  const isLoading = categoriesLoading || colorsLoading;
  const isError = categoriesError || colorsError;

  if (isLoading) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Spinner variant="ellipsis" size={32} />
            <p className="mt-4 text-gray-600">Loading categories and colors...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-lg text-red-600 mb-4">Failed to load categories or colors</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Add a new product to your inventory with all the necessary details.</p>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/admin/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Create Product</span>
          </nav>
        </div>

        {/* Form Container */}
        <CreateProductForm categories={categories} colors={colors} />

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Need help creating a product?</h4>
              <p className="text-blue-800 text-sm mb-2">
                Make sure to provide clear, detailed information to help customers understand your product.
              </p>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Use high-quality images that show the product clearly</li>
                <li>• Write descriptive titles that include key features</li>
                <li>• Set competitive pricing based on market research</li>
                <li>• Keep stock quantities accurate for better inventory management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreateProductPage;