import type { Cart, CartBreakdown } from "@/features/products/types/ecommerce";
import type { EcommerceOrder } from "@/features/products/types/ecommerce";

export interface OrderSummaryData {
  productItems: OrderSummaryLineItem[];
  serviceItems: OrderSummaryLineItem[];
  breakdown: CartBreakdown;
}

export interface OrderSummaryLineItem {
  id: string;
  name: string;
  quantity: number;
  subtotal: number;
  imageUrl: string | null;
  description?: string | null;
}

function breakdownFromOrder(order: EcommerceOrder): CartBreakdown {
  const subtotal = Number(order.subtotal ?? 0);
  const igv = Number(order.igv ?? 0);
  const total = Number(order.total ?? 0);
  const productItems = order.items.filter((item) => item.itemType === "product");
  const serviceItems = order.items.filter((item) => item.itemType === "service");

  return {
    productsSubtotal: productItems.reduce((sum, item) => sum + Number(item.subtotal), 0),
    servicesSubtotal: serviceItems.reduce((sum, item) => sum + Number(item.subtotal), 0),
    productLineCount: productItems.length,
    serviceLineCount: serviceItems.length,
    subtotal,
    igv,
    total,
    hasIgv: igv > 0,
    hasExcludedIgvProducts: false,
  };
}

export function getOrderSummaryFromCart(cart: Cart): OrderSummaryData {
  const productItems = cart.items
    .filter((item) => item.itemType === "product")
    .map((item) => {
      const line = item.product;
      return {
        id: item.id,
        name: line?.name ?? "Producto",
        quantity: item.quantity,
        subtotal: Number(line?.price ?? 0) * item.quantity,
        imageUrl: line?.imageUrl ?? null,
      };
    });

  const serviceItems = cart.items
    .filter((item) => item.itemType === "service")
    .map((item) => {
      const line = item.service;
      return {
        id: item.id,
        name: line?.name ?? "Servicio",
        quantity: item.quantity,
        subtotal: Number(line?.price ?? 0) * item.quantity,
        imageUrl: line?.imageUrl ?? null,
        description: line?.description,
      };
    });

  return {
    productItems,
    serviceItems,
    breakdown: cart.breakdown,
  };
}

export function getOrderSummaryFromOrder(order: EcommerceOrder): OrderSummaryData {
  const productItems = order.items
    .filter((item) => item.itemType === "product")
    .map((item) => ({
      id: item.id,
      name: item.productName,
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
      imageUrl: item.product?.imageUrl ?? null,
    }));

  const serviceItems = order.items
    .filter((item) => item.itemType === "service")
    .map((item) => ({
      id: item.id,
      name: item.productName,
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
      imageUrl: item.service?.imageUrl ?? null,
      description: item.itemDescription ?? item.service?.description,
    }));

  return {
    productItems,
    serviceItems,
    breakdown: breakdownFromOrder(order),
  };
}
