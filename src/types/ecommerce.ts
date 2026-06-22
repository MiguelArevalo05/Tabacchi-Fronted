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
  stock?: number;
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
