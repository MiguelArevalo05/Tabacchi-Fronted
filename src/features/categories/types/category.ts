import type { PaginatedResponse, PaginationQuery } from "@/features/products/types/ecommerce";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export type UpdateCategoryRequest = Partial<CategoryFormData>;

export type CategoryQuery = PaginationQuery;

export type PaginatedCategories = PaginatedResponse<Category>;
