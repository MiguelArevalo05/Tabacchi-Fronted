import type { CategoryQuery } from "@/features/categories/types/category";
import type { PaginationQuery } from "@/features/products/types/ecommerce";

export const queryKeys = {
  categories: (params?: CategoryQuery) => ["categories", params] as const,
  categoryBySlug: (slug: string) => ["categories", "slug", slug] as const,
  products: (params?: PaginationQuery) => ["products", params] as const,
  product: (id: string) => ["products", "detail", id] as const,
  services: (params?: PaginationQuery) => ["services", params] as const,
};
