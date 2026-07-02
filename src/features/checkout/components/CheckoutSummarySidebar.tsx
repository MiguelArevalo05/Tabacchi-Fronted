"use client";

import type { Cart } from "@/features/products/types/ecommerce";
import OrderSummarySidebar from "@/features/checkout/components/OrderSummarySidebar";
import { getOrderSummaryFromCart } from "@/features/checkout/utils/orderSummary";

interface CheckoutSummarySidebarProps {
  cart: Cart;
}

export default function CheckoutSummarySidebar({ cart }: CheckoutSummarySidebarProps) {
  return (
    <OrderSummarySidebar
      summary={getOrderSummaryFromCart(cart)}
      editCartHref="/carrito"
    />
  );
}
