import { CartItem, CartItemType } from "@/features/products/types/ecommerce";

export function getCartItemCode(item: CartItem): string {
  const sourceId = item.productId ?? item.serviceId ?? item.id;
  const prefix = item.itemType === CartItemType.SERVICE ? "SER" : "PRD";
  return `${prefix}-${sourceId.slice(0, 8).toUpperCase()}`;
}

export function getProductStockBadge(stock: number): { label: string; className: string } {
  if (stock > 0) {
    return {
      label: "En stock",
      className: "bg-[#e8f7ee] text-[#1f8f4a]",
    };
  }

  return {
    label: "Sin stock",
    className: "bg-[#fff4e5] text-[#b45309]",
  };
}

export function getServiceAvailabilityBadge(isActive: boolean): {
  label: string;
  className: string;
} {
  if (isActive) {
    return {
      label: "Disponible",
      className: "bg-[#eef2f7] text-[#5b6472]",
    };
  }

  return {
    label: "No disponible",
    className: "bg-[#f3f4f6] text-[#9ca3af]",
  };
}
