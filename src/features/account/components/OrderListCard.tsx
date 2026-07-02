import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import OrderStatusBadge from "@/features/account/components/OrderStatusBadge";
import {
  formatOrderDate,
  formatOrderId,
  getOrderItemCount,
  getOrderItemsPreview,
} from "@/features/account/utils/orderDisplay";
import { EcommerceOrder, formatPrice } from "@/features/products/types/ecommerce";

interface OrderListCardProps {
  order: EcommerceOrder;
  compact?: boolean;
}

export default function OrderListCard({ order, compact = false }: OrderListCardProps) {
  const itemCount = getOrderItemCount(order);
  const itemsLabel = itemCount === 1 ? "1 producto" : `${itemCount} productos`;

  if (compact) {
    return (
      <Link
        href={`/cuenta/ordenes/${order.id}`}
        className="group flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:border-slate-200 hover:bg-white"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">#{formatOrderId(order.id)}</p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 truncate text-sm text-slate-500">
            {formatOrderDate(order.createdAt)} · {itemsLabel}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <p className="font-bold text-[#17245c]">{formatPrice(order.total)}</p>
          <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-[#17245c]">Orden #{formatOrderId(order.id)}</p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-slate-500">{formatOrderDate(order.createdAt)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
          <p className="text-xl font-black text-[#17245c]">{formatPrice(order.total)}</p>
        </div>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17245c]/5 text-[#17245c]">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{itemsLabel}</p>
            <p className="mt-0.5 text-sm text-slate-600">{getOrderItemsPreview(order)}</p>
          </div>
        </div>

        <ul className="space-y-2 rounded-xl bg-slate-50/80 px-4 py-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-slate-700">
                {item.productName}
                <span className="text-slate-400"> × {item.quantity}</span>
              </span>
              <span className="shrink-0 font-medium text-slate-900">
                {formatPrice(item.subtotal)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <Button asChild variant="outline" className="font-bold">
            <Link href={`/cuenta/ordenes/${order.id}`}>
              Ver detalle
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
