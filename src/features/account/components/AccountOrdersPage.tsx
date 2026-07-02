"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import AccountContentSkeleton from "@/features/account/components/AccountContentSkeleton";
import OrderListCard from "@/features/account/components/OrderListCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyOrders } from "@/features/cart/services/orderService";
import { EcommerceOrder } from "@/features/products/types/ecommerce";

function AccountOrdersContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<EcommerceOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (searchParams.get("created")) {
      setToast({ type: "success", message: "¡Orden creada exitosamente!" });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;

    setOrdersLoading(true);
    getMyOrders({ limit: 50 })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <>
      {toast ? (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-900">Historial de compras</p>
          <p className="text-sm text-slate-500">
            {ordersLoading
              ? "Cargando..."
              : orders.length === 0
                ? "Sin órdenes registradas"
                : `${orders.length} ${orders.length === 1 ? "orden" : "órdenes"} en total`}
          </p>
        </div>
        <Button asChild variant="outline" className="font-bold">
          <Link href="/productos">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Seguir comprando
          </Link>
        </Button>
      </div>

      {ordersLoading ? (
        <p className="text-slate-500">Cargando órdenes...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <p className="mb-2 text-lg font-bold text-slate-900">Aún no tienes órdenes</p>
          <p className="mb-6 text-slate-600">
            Cuando realices una compra, aparecerá aquí con su estado y detalle.
          </p>
          <Button asChild className="bg-[#17245c] font-bold hover:bg-[#111a45]">
            <Link href="/productos">Ver productos</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderListCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={<AccountContentSkeleton />}>
      <AccountOrdersContent />
    </Suspense>
  );
}
