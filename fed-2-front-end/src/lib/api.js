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
            Object.entries(params).filter(([_, v]) => v != null && v !== "")
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
