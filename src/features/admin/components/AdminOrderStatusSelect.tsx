"use client";

import { ChevronDown } from "lucide-react";

import {
  ORDER_STATUS_LABELS,
  OrderStatus,
} from "@/features/products/types/ecommerce";

const STATUS_OPTIONS = Object.values(OrderStatus);

const SELECT_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:
    "border-amber-200 bg-amber-50 text-amber-800 focus:border-amber-400 focus:ring-amber-200/60",
  [OrderStatus.CONFIRMED]:
    "border-blue-200 bg-blue-50 text-blue-800 focus:border-blue-400 focus:ring-blue-200/60",
  [OrderStatus.PROCESSING]:
    "border-violet-200 bg-violet-50 text-violet-800 focus:border-violet-400 focus:ring-violet-200/60",
  [OrderStatus.SHIPPED]:
    "border-indigo-200 bg-indigo-50 text-indigo-800 focus:border-indigo-400 focus:ring-indigo-200/60",
  [OrderStatus.DELIVERED]:
    "border-emerald-200 bg-emerald-50 text-emerald-800 focus:border-emerald-400 focus:ring-emerald-200/60",
  [OrderStatus.CANCELLED]:
    "border-red-200 bg-red-50 text-red-800 focus:border-red-400 focus:ring-red-200/60",
};

interface AdminOrderStatusSelectProps {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
}

export default function AdminOrderStatusSelect({
  value,
  onChange,
  disabled = false,
}: AdminOrderStatusSelectProps) {
  return (
    <div className="relative inline-flex w-full min-w-[160px] max-w-[200px]">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as OrderStatus)}
        aria-label="Estado de la orden"
        className={[
          "w-full appearance-none rounded-xl border py-2 pl-3 pr-8 text-xs font-semibold outline-none transition focus:ring-2 disabled:cursor-wait disabled:opacity-60",
          SELECT_STYLES[value],
        ].join(" ")}
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60"
        aria-hidden
      />
    </div>
  );
}
