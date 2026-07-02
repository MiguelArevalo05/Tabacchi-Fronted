"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Package, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import OrderListCard from "@/features/account/components/OrderListCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyOrders } from "@/features/cart/services/orderService";
import { EcommerceOrder } from "@/features/products/types/ecommerce";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<EcommerceOrder[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getMyOrders({ limit: 5 })
      .then((res) => {
        setOrders(res.data);
        setOrdersTotal(res.meta.total);
      })
      .catch(() => {
        setOrders([]);
        setOrdersTotal(0);
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (!user) return null;

  const recentOrders = orders.slice(0, 3);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[#17245c]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17245c]/5">
              <User className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold">Mis datos</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nombre
              </dt>
              <dd className="mt-1 font-medium text-slate-900">{user.fullName || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Teléfono
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {user.phone || "Sin registrar"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Correo
              </dt>
              <dd className="mt-1 font-medium text-slate-900">{user.email}</dd>
            </div>
          </dl>
          <Button asChild variant="outline" className="mt-5 w-full font-bold">
            <Link href="/cuenta/perfil">Editar perfil</Link>
          </Button>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[#17245c]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17245c]/5">
              <Package className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold">Mis órdenes</h2>
          </div>
          <p className="text-4xl font-black text-[#17245c]">
            {ordersLoading ? "…" : ordersTotal}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {ordersTotal === 0
              ? "Aún no has realizado compras"
              : `${ordersTotal === 1 ? "Compra registrada" : "Compras registradas"} en tu cuenta`}
          </p>
          <Button asChild className="mt-5 w-full bg-[#17245c] font-bold hover:bg-[#111a45]">
            <Link href="/cuenta/ordenes">
              Ver historial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[#17245c]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d71920]/10 text-[#d71920]">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold">Catálogo</h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Explora productos y realiza nuevas compras cuando lo necesites.
          </p>
          <Button asChild className="mt-5 w-full bg-[#d71920] font-bold hover:bg-[#b9151b]">
            <Link href="/productos">Ir al catálogo</Link>
          </Button>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#17245c]">Actividad reciente</h2>
            <p className="text-sm text-slate-500">Tus últimas órdenes y su estado actual</p>
          </div>
          {ordersTotal > 0 ? (
            <Link
              href="/cuenta/ordenes"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#d71920] hover:underline"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        {ordersLoading ? (
          <p className="text-slate-500">Cargando órdenes...</p>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-8 text-center">
            <p className="font-medium text-slate-700">Aún no tienes órdenes registradas</p>
            <p className="mt-1 text-sm text-slate-500">
              Tu primera compra aparecerá aquí con acceso rápido al detalle.
            </p>
            <Button asChild className="mt-4 bg-[#17245c] font-bold hover:bg-[#111a45]">
              <Link href="/productos">Comenzar a comprar</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderListCard key={order.id} order={order} compact />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
