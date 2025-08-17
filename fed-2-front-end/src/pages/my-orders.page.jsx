import { useGetMyOrdersQuery } from "@/lib/api";
import { Link } from "react-router-dom";

export default function MyOrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetMyOrdersQuery();

  // Helper function to format status display
  const formatStatus = (paymentStatus, orderStatus) => {
    const payment = paymentStatus || "PENDING";
    const order = orderStatus || "PENDING";
    
    if (payment === "PENDING" && order === "PENDING") {
      return "Payment Pending • Order Pending";
    }
    return `Payment ${payment} • Order ${order}`;
  };

  // Helper function to get status color
  const getStatusColor = (paymentStatus, orderStatus) => {
    if (paymentStatus === "COMPLETED" && orderStatus === "DELIVERED") {
      return "text-green-600";
    } else if (paymentStatus === "FAILED" || orderStatus === "CANCELLED") {
      return "text-red-600";
    } else if (paymentStatus === "PENDING" || orderStatus === "PENDING") {
      return "text-yellow-600";
    }
    return "text-blue-600";
  };

  if (isLoading) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Couldn't load your orders</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h1 className="text-4xl font-bold">My Orders</h1>
        <div className="text-sm opacity-70">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </div>
      </div>

      {!orders.length && (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-lg mb-4 opacity-70">No orders yet</p>
          <Link 
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors" 
            to="/shop"
          >
            Start Shopping
          </Link>
        </div>
      )}

      <div className="grid gap-6">
        {orders.map((order) => (
          <article key={order._id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
            <header className="flex items-start justify-between mb-4">
              <div>
                <div className="font-medium text-lg mb-1">
                  Order: {order._id || 'Unknown'}
                </div>
                {order.createdAt && (
                  <div className="text-sm opacity-70">
                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-semibold text-xl mb-1">
                  ${order.amount?.toFixed?.(2) ?? order.amount ?? '0.00'}
                </div>
                <div className={`text-sm font-medium ${getStatusColor(order.paymentStatus, order.orderStatus)}`}>
                  {formatStatus(order.paymentStatus, order.orderStatus)}
                </div>
              </div>
            </header>

            {order.items && order.items.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 text-sm opacity-70 uppercase tracking-wide">
                  Items ({order.items.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {order.items.map((item, index) => {
                    const product = item.productId;
                    const itemTotal = ((product?.price ?? 0) * (item.quantity || 1)).toFixed(2);
                    
                    return (
                      <div key={product?._id || index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                        {product?.image && (
                          <img 
                            src={product.image} 
                            alt={product.name || 'Product'} 
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                          />
                        )}
                        <div className="flex-grow min-w-0">
                          <div className="font-medium text-sm truncate">
                            {product?.name || "Unknown Product"}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            Quantity: {item.quantity || 1}
                          </div>
                          <div className="text-sm font-medium mt-1">
                            ${itemTotal}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}