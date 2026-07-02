import type { Category, CategoryQuery, PaginatedCategories } from "@/features/categories/types/category";
import type {
  PaginatedResponse,
  PaginationQuery,
  Product,
  ServiceOffering,
} from "@/features/products/types/ecommerce";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function toQueryParams(params?: PaginationQuery | CategoryQuery): QueryParams | undefined {
  if (!params) return undefined;
  return params as QueryParams;
}

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(`${API_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function serverFetch<T>(path: string, params?: QueryParams): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProductsServer(
  params?: PaginationQuery
): Promise<PaginatedResponse<Product>> {
  return serverFetch<PaginatedResponse<Product>>("/products", toQueryParams(params));
}

export function getProductByIdServer(id: string): Promise<Product> {
  return serverFetch<Product>(`/products/${id}`);
}

export function getCategoriesServer(
  params?: CategoryQuery
): Promise<PaginatedCategories> {
  return serverFetch<PaginatedCategories>("/categories", toQueryParams(params));
}

export function getCategoryBySlugServer(slug: string): Promise<Category> {
  return serverFetch<Category>(`/categories/slug/${slug}`);
}

export function getServicesServer(
  params?: PaginationQuery
): Promise<PaginatedResponse<ServiceOffering>> {
  return serverFetch<PaginatedResponse<ServiceOffering>>("/services", toQueryParams(params));
}
