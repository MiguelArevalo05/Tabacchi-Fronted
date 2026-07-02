import { Cart, CartItem, getCartLineItem } from "@/features/products/types/ecommerce";

export type { CartBreakdown } from "@/features/products/types/ecommerce";

export function getLineSubtotal(item: CartItem): number {
  const line = getCartLineItem(item);
  if (!line) return 0;
  return Number(line.price) * item.quantity;
}

export function getCartBreakdown(cart: Cart) {
  return cart.breakdown;
}
