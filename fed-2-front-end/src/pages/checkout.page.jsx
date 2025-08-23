import CartItem from "@/components/CartItem";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function CheckoutPage() {
  const cart = useSelector((state) => state.cart.cartItems);

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // In case of : Add shipping and tax calculations later

  const total = subtotal;

  if (cart.length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Checkout</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              Shipping Address
            </h3>
            <ShippingAddressForm />
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              Order Summary
            </h3>

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
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure checkout powered by SSL encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Cart</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-blue-200"></div>
            
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Checkout</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            
            <div className="flex items-center">
              <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Payment</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;