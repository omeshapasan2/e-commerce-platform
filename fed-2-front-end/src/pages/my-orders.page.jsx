import { useGetMyOrdersQuery } from "@/lib/api";
import { Link } from "react-router-dom";

export default function MyOrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetMyOrdersQuery();

  if (isLoading) return <main className="px-4 lg:px-16 py-8">Loading…</main>;
  if (isError) return <main className="px-4 lg:px-16 py-8">Couldn’t load orders.</main>;

  return (
    <main className="px-4 lg:px-16 py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {!orders.length && (
        <p>No orders yet. <Link className="underline" to="/shop">Start shopping</Link>.</p>
      )}

      <div className="space-y-4">
        {orders.map((o) => (
          <article key={o._id} className="border rounded-lg p-4">
            <header className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order #{o._id.slice(-6)}</div>
                {o.createdAt && (
                  <div className="text-sm opacity-70">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-semibold">${o.amount?.toFixed?.(2) ?? o.amount ?? 0}</div>
                <div className="text-sm opacity-70">{o.paymentStatus} • {o.orderStatus}</div>
              </div>
            </header>

            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {o.items?.map((it) => {
                const p = it.productId; // populated
                return (
                  <li key={p?._id || Math.random()} className="flex gap-3 items-center">
                    {p?.image && (
                      <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded" />
                    )}
                    <div className="grow">
                      <div className="text-sm font-medium">{p?.name || "Product"}</div>
                      <div className="text-xs opacity-70">Qty: {it.quantity}</div>
                    </div>
                    <div className="text-sm">
                      ${((p?.price ?? 0) * it.quantity).toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </main>
  );
}