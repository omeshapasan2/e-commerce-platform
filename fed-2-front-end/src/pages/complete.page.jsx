import { Button } from "@/components/ui/button";
import { useGetCheckoutSessionStatusQuery } from "@/lib/api";
import { Link, Navigate, useSearchParams } from "react-router";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function CompletePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading: apiLoading, isError } = useGetCheckoutSessionStatusQuery(sessionId);

  if (apiLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <Spinner variant="ellipsis" size={32} />
            <p className="mt-4 text-gray-600">Processing your order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't process your order. Please try again or contact support.</p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/cart">Return to Cart</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (data?.status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (data?.status === "complete") {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Order Complete!</h1>
              <p className="text-gray-600">Thank you for your purchase</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                <span className="font-medium">Confirmation sent to:</span>{" "}
                <span className="font-semibold">{data.customer_email}</span>
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono font-medium text-sm bg-white px-2 py-1 rounded border">
                    {data.orderId}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Order Status</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {data.orderStatus}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {data.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• You'll receive an order confirmation email shortly</li>
                <li>• We'll send shipping updates to your email</li>
                <li>• Your order will be processed within 1-2 business days</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link to="/">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/account/orders">View My Orders</Link>
              </Button>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, we're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="mailto:orders@example.com" 
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                orders@example.com
              </a>
              <a 
                href="tel:+1234567890" 
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (123) 456-7890
              </a>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Cart</span>
              </div>
              
              <div className="flex-1 h-0.5 bg-green-400"></div>
              
              <div className="flex items-center">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Checkout</span>
              </div>
              
              <div className="flex-1 h-0.5 bg-green-400"></div>
              
              <div className="flex items-center">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Payment</span>
              </div>

              <div className="flex-1 h-0.5 bg-green-400"></div>
              
              <div className="flex items-center">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
}

export default CompletePage;