import api from "./interceptor";
import { buildProductFormData } from "@/lib/formData";
import type {
  PaginatedResponse,
  PaginationQuery,
  Product,
  ProductFormData,
  UpdateProductRequest,
} from "@/types/ecommerce";

const API_URL = "/products";

export const getProducts = async (
  params?: PaginationQuery
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get<PaginatedResponse<Product>>(API_URL, {
    params,
  });
  return response.data;
};

export const getProductsAdmin = async (
  params?: PaginationQuery
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get<PaginatedResponse<Product>>(
    `${API_URL}/admin/all`,
    { params }
  );
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (
  data: ProductFormData,
  image: File
): Promise<Product> => {
  const formData = buildProductFormData(data, image);
  const response = await api.post<Product>(API_URL, formData);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductRequest,
  image?: File | null
): Promise<Product> => {
  const formData = buildProductFormData(data, image);
  const response = await api.patch<Product>(`${API_URL}/${id}`, formData);
  return response.data;
};

export const updateProductAvailability = async (
  id: string,
  isActive: boolean
): Promise<Product> => {
  const response = await api.patch<Product>(`${API_URL}/${id}/availability`, {
    isActive,
  });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
