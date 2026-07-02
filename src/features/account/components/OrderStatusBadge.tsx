import { OrderStatus } from "@/features/products/types/ecommerce";
import {
  getOrderStatusLabel,
  ORDER_STATUS_COLORS,
} from "@/features/account/utils/orderDisplay";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export default function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${ORDER_STATUS_COLORS[status]} ${className}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}
