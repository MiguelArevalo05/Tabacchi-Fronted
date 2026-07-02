"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getCategories,
  getCategoryBySlug,
} from "@/features/categories/services/categoryService";
import type { Category, CategoryQuery, PaginatedCategories } from "@/features/categories/types/category";
import { queryKeys } from "@/lib/queryKeys";

export function useCategories(
  params: CategoryQuery = { limit: 50 },
  initialData?: PaginatedCategories
) {
  return useQuery({
    queryKey: queryKeys.categories(params),
    queryFn: () => getCategories(params),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string | null, initialData?: Category | null) {
  return useQuery({
    queryKey: queryKeys.categoryBySlug(slug ?? ""),
    queryFn: () => getCategoryBySlug(slug!),
    enabled: Boolean(slug),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
