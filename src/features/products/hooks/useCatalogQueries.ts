"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getProductById,
  getProducts,
} from "@/features/products/services/productService";
import { getServices } from "@/features/products/services/serviceOfferingService";
import type {
  PaginatedResponse,
  PaginationQuery,
  Product,
  ServiceOffering,
} from "@/features/products/types/ecommerce";
import { queryKeys } from "@/lib/queryKeys";

export function useProducts(
  params: PaginationQuery = { limit: 50 },
  initialData?: PaginatedResponse<Product>
) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string, initialData?: Product | null) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}

export function useServices(
  params: PaginationQuery = { limit: 20 },
  initialData?: PaginatedResponse<ServiceOffering>
) {
  return useQuery({
    queryKey: queryKeys.services(params),
    queryFn: () => getServices(params),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}
