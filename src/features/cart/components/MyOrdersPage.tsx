"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

import StoreHeader from "@/components/layout/StoreHeader";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyOrders } from "@/features/cart/services/orderService";
import {
  EcommerceOrder,
  formatPrice,
  ORDER_STATUS_LABELS,
} from "@/features/products/types/ecommerce";

function MyOrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<EcommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/my-orders");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (searchParams.get("created")) {
      setToast({ type: "success", message: "¡Orden creada exitosamente!" });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    getMyOrders({ limit: 50 })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Mis órdenes</h1>
          <Button asChild variant="outline">
            <Link href="/productos">Seguir comprando</Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-slate-500">Cargando órdenes...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-600 mb-6">Aún no tienes órdenes.</p>
            <Button asChild className="bg-blue-700 hover:bg-blue-800">
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-100 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Orden #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("es-PE", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-slate-600">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-4">
                  <span>Total</span>
                  <span className="text-blue-700">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <MyOrdersContent />
    </Suspense>
  );
}
