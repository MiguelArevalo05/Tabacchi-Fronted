import api from "@/lib/api";
import type {
  Category,
  CategoryFormData,
  CategoryQuery,
  PaginatedCategories,
  UpdateCategoryRequest,
} from "@/features/categories/types/category";

const API_URL = "/categories";

export const getCategories = async (
  params?: CategoryQuery
): Promise<PaginatedCategories> => {
  const response = await api.get<PaginatedCategories>(API_URL, { params });
  return response.data;
};

export const getCategoriesAdmin = async (
  params?: CategoryQuery
): Promise<PaginatedCategories> => {
  const response = await api.get<PaginatedCategories>(`${API_URL}/admin/all`, {
    params,
  });
  return response.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await api.get<Category>(`${API_URL}/slug/${slug}`);
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get<Category>(`${API_URL}/${id}`);
  return response.data;
};

export const createCategory = async (
  data: CategoryFormData,
  image?: File | null
): Promise<Category> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description ?? "");
  formData.append("displayOrder", String(data.displayOrder ?? 0));
  formData.append("isActive", String(data.isActive ?? true));
  if (image) formData.append("image", image);

  const response = await api.post<Category>(API_URL, formData);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest,
  image?: File | null
): Promise<Category> => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.displayOrder !== undefined) {
    formData.append("displayOrder", String(data.displayOrder));
  }
  if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
  if (image) formData.append("image", image);

  const response = await api.patch<Category>(`${API_URL}/${id}`, formData);
  return response.data;
};

export const updateCategoryAvailability = async (
  id: string,
  isActive: boolean
): Promise<Category> => {
  const response = await api.patch<Category>(`${API_URL}/${id}/availability`, {
    isActive,
  });
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
