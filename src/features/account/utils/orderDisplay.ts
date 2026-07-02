import {
  EcommerceOrder,
  ORDER_STATUS_LABELS,
  OrderStatus,
} from "@/features/products/types/ecommerce";

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-50 text-amber-800 ring-amber-200",
  [OrderStatus.CONFIRMED]: "bg-blue-50 text-blue-800 ring-blue-200",
  [OrderStatus.PROCESSING]: "bg-violet-50 text-violet-800 ring-violet-200",
  [OrderStatus.SHIPPED]: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  [OrderStatus.DELIVERED]: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  [OrderStatus.CANCELLED]: "bg-red-50 text-red-800 ring-red-200",
};

export function formatOrderId(orderId: string): string {
  return orderId.slice(0, 8).toUpperCase();
}

export function formatOrderDate(
  value: string,
  options: { includeTime?: boolean } = {}
): string {
  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "medium",
    ...(options.includeTime ? { timeStyle: "short" } : {}),
  });
}

export function getOrderItemCount(order: EcommerceOrder): number {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

export function getOrderItemsPreview(order: EcommerceOrder, maxNames = 2): string {
  const names = order.items.map((item) => item.productName);

  if (names.length === 0) return "Sin productos";
  if (names.length <= maxNames) return names.join(", ");

  const visible = names.slice(0, maxNames).join(", ");
  const remaining = names.length - maxNames;

  return `${visible} y ${remaining} más`;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}
