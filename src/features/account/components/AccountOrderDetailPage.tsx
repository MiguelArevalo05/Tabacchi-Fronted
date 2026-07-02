"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Phone, StickyNote } from "lucide-react";

import { Button } from "@/components/ui/button";
import OrderStatusBadge from "@/features/account/components/OrderStatusBadge";
import {
  formatOrderDate,
  formatOrderId,
  getOrderItemCount,
} from "@/features/account/utils/orderDisplay";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getOrderById } from "@/features/cart/services/orderService";
import { EcommerceOrder, formatPrice } from "@/features/products/types/ecommerce";

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const { user } = useAuth();
  const [order, setOrder] = useState<EcommerceOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user || !orderId) return;

    setOrderLoading(true);
    setError(false);
    setOrder(null);

    getOrderById(orderId)
      .then(setOrder)
      .catch(() => {
        setOrder(null);
        setError(true);
      })
      .finally(() => setOrderLoading(false));
  }, [user, orderId]);

  if (!user) return null;

  return (
    <>
      <Button asChild variant="outline" className="mb-6 font-bold">
        <Link href="/cuenta/ordenes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mis órdenes
        </Link>
      </Button>

      {orderLoading ? (
        <p className="text-slate-500">Cargando detalle...</p>
      ) : error || !order ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">No se pudo cargar esta orden.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-black text-[#17245c]">
                    Orden #{formatOrderId(order.id)}
                  </h2>
                  <OrderStatusBadge status={order.status} className="text-sm" />
                </div>
                <p className="text-sm text-slate-500">
                  Realizada el {formatOrderDate(order.createdAt, { includeTime: true })}
                </p>
                <p className="text-sm text-slate-600">
                  {getOrderItemCount(order)}{" "}
                  {getOrderItemCount(order) === 1 ? "producto" : "productos"} en esta compra
                </p>
              </div>

              <div className="rounded-xl bg-[#17245c]/5 px-5 py-4 text-left lg:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total pagado
                </p>
                <p className="mt-1 text-3xl font-black text-[#17245c]">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-bold text-[#17245c]">Productos</h3>
              <ul className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-[#17245c]">
                      ×{item.quantity}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{item.productName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Precio unitario: {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-[#17245c]">
                      {formatPrice(item.subtotal)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-base font-bold text-slate-700">Total</span>
                <span className="text-xl font-black text-[#17245c]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-[#17245c]">Resumen</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">N.º de orden</dt>
                    <dd className="font-mono font-semibold text-slate-900">
                      #{formatOrderId(order.id)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Estado</dt>
                    <dd>
                      <OrderStatusBadge status={order.status} />
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Fecha</dt>
                    <dd className="text-right font-medium text-slate-900">
                      {formatOrderDate(order.createdAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                    <dt className="font-semibold text-slate-700">Total</dt>
                    <dd className="font-black text-[#17245c]">{formatPrice(order.total)}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-[#17245c]">Datos de entrega</h3>
                <dl className="space-y-4">
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Teléfono
                      </dt>
                      <dd className="mt-1 text-sm text-slate-900">
                        {order.contactPhone || "No registrado"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Dirección
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate-900">
                        {order.shippingAddress || "No registrada"}
                      </dd>
                    </div>
                  </div>

                  {order.notes ? (
                    <div className="flex gap-3">
                      <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Notas
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed text-slate-900">
                          {order.notes}
                        </dd>
                      </div>
                    </div>
                  ) : null}
                </dl>
              </section>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
