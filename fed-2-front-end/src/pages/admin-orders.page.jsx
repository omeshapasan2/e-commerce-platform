import { useGetAllOrdersQuery } from "@/lib/api";
import { useState } from "react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetAllOrdersQuery();
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Helper function to toggle expanded state for orders
  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  // Helper function to format status display
  const formatStatus = (paymentStatus, orderStatus) => {
    const payment = paymentStatus || "PENDING";
    const order = orderStatus || "PENDING";
    
    if (payment === "PENDING" && order === "PENDING") {
      return { payment: "Payment Pending", order: "Order Pending" };
    }
    return { payment: `Payment ${payment}`, order: `Order ${order}` };
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    if (status.includes("COMPLETED") || status.includes("DELIVERED")) {
      return "text-green-600 bg-green-50";
    } else if (status.includes("FAILED") || status.includes("CANCELLED")) {
      return "text-red-600 bg-red-50";
    } else if (status.includes("PENDING")) {
      return "text-yellow-700 bg-yellow-50";
    } else if (status.includes("PROCESSING") || status.includes("SHIPPED")) {
      return "text-blue-600 bg-blue-50";
    }
    return "text-gray-600 bg-gray-50";
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

  if (isError) {
    return (
      <main className="px-4 lg:px-16 min-h-screen py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Couldn't load orders</p>
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
        <h1 className="text-4xl font-bold">All Orders</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm opacity-70">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Admin View
          </div>
        </div>
      </div>

      {!orders.length && (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-lg opacity-70">No orders found</p>
        </div>
      )}

      {orders.length > 0 && (
        <>
          {/* Mobile/Tablet Card View */}
          <div className="grid gap-6 lg:hidden">
            {orders.map((order) => {
              const status = formatStatus(order.paymentStatus, order.orderStatus);
              const address = order.address || {};
              
              return (
                <article key={order._id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <header className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-medium text-lg mb-1">
                        Order: {order._id || 'Unknown'}
                      </div>
                      <div className="text-sm opacity-70 mb-2">
                        User: {order.userId || 'Unknown'}
                      </div>
                      {order.createdAt && (
                        <div className="text-sm opacity-70">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-xl mb-2">
                        ${order.amount?.toFixed?.(2) ?? order.amount ?? '0.00'}
                      </div>
                      <div className="space-y-1">
                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status.payment)}`}>
                          {status.payment}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status.order)}`}>
                          {status.order}
                        </div>
                      </div>
                    </div>
                  </header>
                    
                  {/* Address */}
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 text-sm opacity-70 uppercase tracking-wide">Address</h3>
                    <div className="text-sm space-y-1">
                      <div>{address.line_1 || 'N/A'}</div>
                      {address.line_2 && <div>{address.line_2}</div>}
                      <div>{address.city || 'N/A'}</div>
                      <div>{address.phone || 'N/A'}</div>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3 text-sm opacity-70 uppercase tracking-wide">
                        Items ({order.items.length})
                      </h3>
                      <div className="space-y-2">
                        {order.items.map((item, index) => {
                          const product = item.productId;
                          const itemTotal = ((product?.price ?? 0) * (item.quantity || 1)).toFixed(2);
                          
                          return (
                            <div key={product?._id || index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                              {product?.image && (
                                <img 
                                  src={product.image} 
                                  alt={product.name || 'Product'} 
                                  className="w-12 h-12 object-cover rounded flex-shrink-0" 
                                />
                              )}
                              <div className="flex-grow min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {product?.name || "Unknown Product"}
                                </div>
                                <div className="text-xs opacity-70">
                                  Qty: {item.quantity || 1} × ${product?.price ?? 0} = ${itemTotal}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="py-4 px-6 font-semibold text-sm">Order ID</th>
                  <th className="py-4 px-6 font-semibold text-sm">User</th>
                  <th className="py-4 px-6 font-semibold text-sm">Address</th>
                  <th className="py-4 px-6 font-semibold text-sm">Items</th>
                  <th className="py-4 px-6 font-semibold text-sm">Amount</th>
                  <th className="py-4 px-6 font-semibold text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-sm">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => {
                  const status = formatStatus(order.paymentStatus, order.orderStatus);
                  const address = order.address || {};
                  
                  return (
                    <tr key={order._id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      {/* Order ID */}
                      <td className="py-4 px-6">
                        <div className="font-mono text-sm break-all">
                          {order._id || 'Unknown'}
                        </div>
                      </td>
                      {/* User ID */}
                      <td className="py-4 px-6">
                        <div className="text-sm break-all">
                          {order.userId || 'Unknown'}
                        </div>
                      </td>
                      {/* Address */}
                      <td className="py-4 px-6">
                        <div className="text-sm space-y-1 break-words">
                          <div>{address.line_1 || 'N/A'}</div>
                          {address.line_2 && <div>{address.line_2}</div>}
                          <div>{address.city || 'N/A'}</div>
                          <div>{address.phone || 'N/A'}</div>
                        </div>
                      </td>
                      {/* Items with expand/collapse */}
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-1">
                              {/* Always show first 2 items */}
                              {order.items.slice(0, 2).map((item, index) => {
                                const product = item.productId;
                                return (
                                  <div key={product?._id || index} className="text-sm">
                                    <span className="font-medium">
                                      {product?.name || "Unknown Product"}
                                    </span>
                                    <span className="opacity-70">
                                      {" "}× {item.quantity || 1} — ${product?.price ?? 0}
                                    </span>
                                  </div>
                                );
                              })}
                              
                              {/* Show remaining items if expanded */}
                              {expandedOrders.has(order._id) && order.items.length > 2 && (
                                <>
                                  {order.items.slice(2).map((item, index) => {
                                    const product = item.productId;
                                    return (
                                      <div key={product?._id || index} className="text-sm">
                                        <span className="font-medium">
                                          {product?.name || "Unknown Product"}
                                        </span>
                                        <span className="opacity-70">
                                          {" "}× {item.quantity || 1} — ${product?.price ?? 0}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                              
                              {/* Show expand/collapse button if more than 2 items */}
                              {order.items.length > 2 && (
                                <button
                                  onClick={() => toggleOrderExpansion(order._id)}
                                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                >
                                  {expandedOrders.has(order._id) 
                                    ? "- Show less" 
                                    : `+${order.items.length - 2} more items`
                                  }
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm opacity-70">No items</span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-lg">
                          ${order.amount?.toFixed?.(2) ?? order.amount ?? '0.00'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${getStatusColor(status.payment)}`}>
                            {status.payment}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${getStatusColor(status.order)}`}>
                            {status.order}
                          </div>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          {order.createdAt 
                            ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '-'
                          }
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}