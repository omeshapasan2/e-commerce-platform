import CartItem from "@/components/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useSearchParams } from "react-router";
import PaymentForm from "@/components/PaymentForm";

function PaymentPage() {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const total = subtotal;

  if (cart.length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Payment</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              Payment Details
            </h3>
            <PaymentForm orderId={orderId} />
          </div>

          {/* Right Column - Order Review */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
            <h3 className="text-2xl font-semibold mb-6">Order Review</h3>

            {/* Cart Items */}
            <div className="mb-6">
              <h4 className="font-medium mb-4 text-gray-700">
                Items ({cart.length})
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.product._id}-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-grow min-w-0">
                      <h5 className="font-medium text-sm truncate">
                        {item.product.name}
                      </h5>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity} × ${item.product.price}
                      </p>
                    </div>
                    <div className="font-semibold text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="pt-4 space-y-3">
              <hr className="border-gray-200" />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Order ID Display */}
            {orderId && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Order ID:</span> {orderId}
                </div>
              </div>
            )}

            {/* Security & Trust Badges */}
            <div className="mt-6 space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>256-bit SSL encryption</span>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>PCI DSS compliant</span>
                </div>
              </div>
            </div>
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
            
            <div className="flex-1 h-0.5 bg-blue-200"></div>
            
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Payment</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="text-center text-sm text-gray-600">
            <p>Need help? Contact us at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a> or call <a href="tel:+1234567890" className="text-blue-600 hover:underline">(123) 456-7890</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaymentPage;