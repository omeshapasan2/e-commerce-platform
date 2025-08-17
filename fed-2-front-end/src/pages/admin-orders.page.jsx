import { useGetAllOrdersQuery } from "@/lib/api";

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetAllOrdersQuery();

  if (isLoading) return <main className="px-4 lg:px-16 py-8">Loading…</main>;
  if (isError) return <main className="px-4 lg:px-16 py-8">Couldn’t load orders.</main>;

  return (
    <main className="px-4 lg:px-16 py-8">
      <h1 className="text-2xl font-bold mb-4">All Orders (Admin)</h1>

      {!orders.length && <p>No orders found.</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b align-top">
                <td className="py-2 pr-4 font-mono">…{o._id.slice(-6)}</td>
                <td className="py-2 pr-4">{o.userId}</td>
                <td className="py-2 pr-4">
                  <ul className="space-y-1">
                    {o.items?.map((it) => {
                      const p = it.productId;
                      return (
                        <li key={p?._id || Math.random()}>
                          {p?.name || "Product"} × {it.quantity} — ${p?.price ?? 0}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td className="py-2 pr-4 font-semibold">${o.amount ?? 0}</td>
                <td className="py-2 pr-4">
                  {o.paymentStatus} • {o.orderStatus}
                </td>
                <td className="py-2 pr-4">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}