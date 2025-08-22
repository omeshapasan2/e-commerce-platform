/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: "Api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: async (headers) => {
      return new Promise((resolve) => {
        async function checkToken() {
          const clerk = window.Clerk;
          if (clerk) {
            const token = await clerk.session?.getToken();
            headers.set("Authorization", `Bearer ${token}`);
            resolve(headers);
          } else {
            setTimeout(checkToken, 500);
          }
        }
        checkToken();
      });
    },
  }),
  endpoints: (build) => ({
    getAllProducts: build.query({
      query: () => `/products`,
    }),
    getProducts: build.query({
      query: (params = {}) => {
        const qs = new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).filter(([, v]) => v != null && v !== "")
          )
        ).toString();
        return qs ? `/products?${qs}` : `/products`;
      },
    }),
    getProductsBySearch: build.query({
      query: (query) => `/products/search?search=${query}`,
    }),
    getProductById: build.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getAllCategories: build.query({
      query: () => `/categories`,
    }),
    getAllColors: build.query({
      query: () => `/colors`,
    }),
    createProduct: build.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
    }),
    createOrder: build.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
    }),
    createReview: build.mutation({
      query: ({ productId, review, rating, userName, userImage }) => ({
        url: "/reviews",
        method: "POST",
        body: { productId, review, rating, userName, userImage },
      }),

      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        'Review'
      ],
    }),

    getReviewsByProduct: build.query({
      query: (productId) => `/reviews/product/${productId}`,
      providesTags: (result, error, productId) => [
        { type: 'Review', id: productId }
      ],
    }),

    updateReview: build.mutation({
      query: ({ reviewId, review, rating }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body: { review, rating },
      }),
      invalidatesTags: ['Review', 'Product'],
    }),

    deleteReview: build.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Review', 'Product'],
    }),

    getCheckoutSessionStatus: build.query({
      query: (sessionId) => `/payments/session-status?session_id=${sessionId}`,
    }),
    getMyOrders: build.query({
      query: () => `/orders/me`,
    }),
    getAllOrders: build.query({
      query: () => `/orders`,
    }),
    getDailySales: build.query({
      query: (range = "7d") => `/orders/daily-sales?range=${range}`,
    }),

  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllProductsQuery,
  useGetProductsBySearchQuery,
  useCreateOrderMutation,
  useCreateReviewMutation,
  useGetReviewsByProductQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetCheckoutSessionStatusQuery,
  useCreateProductMutation,
  useGetAllCategoriesQuery,
  useGetAllColorsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetDailySalesQuery,
} = Api;
