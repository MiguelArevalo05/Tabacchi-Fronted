export enum CartItemType {
  PRODUCT = "product",
  SERVICE = "service",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  originalPrice?: number | string | null;
  discountPercentage?: number | null;
  badgeLabel?: string | null;
  badgeColor?: ProductBadgeColor | null;
  imageUrl: string | null;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  badgeLabel?: string | null;
  badgeColor?: ProductBadgeColor | null;
  stock?: number | null;
  isActive?: boolean;
}

export type UpdateProductRequest = Partial<ProductFormData>;

export interface ServiceOffering {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  price: number;
  displayOrder?: number;
  isActive?: boolean;
}

export type UpdateServiceRequest = Partial<ServiceFormData>;

export interface CartItem {
  id: string;
  cartId: string;
  itemType: CartItemType;
  productId: string | null;
  product: Product | null;
  serviceId: string | null;
  service: ServiceOffering | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddCartItemRequest {
  itemType: CartItemType;
  productId?: string;
  serviceId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemType: CartItemType;
  productId: string | null;
  product: Product | null;
  serviceId: string | null;
  service: ServiceOffering | null;
  productName: string;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
  createdAt: string;
}

export interface EcommerceOrder {
  id: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
  status: OrderStatus;
  total: number | string;
  notes: string | null;
  shippingAddress: string | null;
  contactPhone: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  notes?: string;
  shippingAddress?: string;
  contactPhone?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pendiente",
  [OrderStatus.CONFIRMED]: "Confirmada",
  [OrderStatus.PROCESSING]: "En proceso",
  [OrderStatus.SHIPPED]: "Enviada",
  [OrderStatus.DELIVERED]: "Entregada",
  [OrderStatus.CANCELLED]: "Cancelada",
};

export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(num || 0);
}

export type ProductBadgeColor = "green" | "indigo" | "amber" | "blue" | "red";

export interface ProductBadgeOption {
  label: string;
  color: ProductBadgeColor;
  className: string;
}

export const PRODUCT_BADGE_OPTIONS: ProductBadgeOption[] = [
  {
    label: "Nuevo",
    color: "green",
    className: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Oferta",
    color: "indigo",
    className: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Destacado",
    color: "amber",
    className: "bg-amber-100 text-amber-700",
  },
  {
    label: "Popular",
    color: "blue",
    className: "bg-blue-100 text-blue-700",
  },
  {
    label: "Liquidación",
    color: "red",
    className: "bg-red-100 text-red-700",
  },
];

export function getProductBadgeOption(
  label?: string | null,
  color?: ProductBadgeColor | null
): ProductBadgeOption | null {
  if (!label) return null;

  return (
    PRODUCT_BADGE_OPTIONS.find(
      (option) => option.label === label && (!color || option.color === color)
    ) ??
    PRODUCT_BADGE_OPTIONS.find((option) => option.label === label) ?? {
      label,
      color: color ?? "green",
      className:
        PRODUCT_BADGE_OPTIONS.find((option) => option.color === color)?.className ??
        PRODUCT_BADGE_OPTIONS[0].className,
    }
  );
}

export type CatalogAvailabilityStatus = "available" | "out_of_stock";

export function getCatalogAvailability(item: {
  isActive: boolean;
}): CatalogAvailabilityStatus {
  return item.isActive ? "available" : "out_of_stock";
}

export const CATALOG_AVAILABILITY_CONFIG: Record<
  CatalogAvailabilityStatus,
  { label: string; className: string }
> = {
  available: {
    label: "Disponible",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  out_of_stock: {
    label: "Agotado",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
};

export function isProductPurchasable(item: {
  isActive: boolean;
  stock: number;
}): boolean {
  return item.isActive && item.stock > 0;
}

export type ServiceAvailabilityStatus = "available" | "unavailable";

export function getServiceAvailability(item: {
  isActive: boolean;
}): ServiceAvailabilityStatus {
  return item.isActive ? "available" : "unavailable";
}

export const SERVICE_AVAILABILITY_CONFIG: Record<
  ServiceAvailabilityStatus,
  { label: string; className: string }
> = {
  available: {
    label: "Disponible",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  unavailable: {
    label: "No disponible",
    className: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  },
};

export function isServicePurchasable(item: { isActive: boolean }): boolean {
  return item.isActive;
}

export function getCartLineItem(item: CartItem) {
  if (item.itemType === CartItemType.SERVICE && item.service) {
    return {
      name: item.service.name,
      price: item.service.price,
      imageUrl: item.service.imageUrl,
      stockLimit: null as number | null,
      label: "Servicio",
    };
  }

  if (item.product) {
    return {
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      stockLimit: item.product.stock,
      label: "Producto",
    };
  }

  return null;
}
