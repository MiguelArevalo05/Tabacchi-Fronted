import api from "./interceptor";
import { buildServiceFormData } from "@/lib/formData";
import type {
  PaginatedResponse,
  PaginationQuery,
  ServiceFormData,
  ServiceOffering,
  UpdateServiceRequest,
} from "@/types/ecommerce";

const API_URL = "/services";

export const getServices = async (
  params?: PaginationQuery
): Promise<PaginatedResponse<ServiceOffering>> => {
  const response = await api.get<PaginatedResponse<ServiceOffering>>(API_URL, {
    params,
  });
  return response.data;
};

export const getServicesAdmin = async (
  params?: PaginationQuery
): Promise<PaginatedResponse<ServiceOffering>> => {
  const response = await api.get<PaginatedResponse<ServiceOffering>>(
    `${API_URL}/admin/all`,
    { params }
  );
  return response.data;
};

export const getServiceById = async (id: string): Promise<ServiceOffering> => {
  const response = await api.get<ServiceOffering>(`${API_URL}/${id}`);
  return response.data;
};

export const createService = async (
  data: ServiceFormData,
  image: File
): Promise<ServiceOffering> => {
  const formData = buildServiceFormData(data, image);
  const response = await api.post<ServiceOffering>(API_URL, formData);
  return response.data;
};

export const updateService = async (
  id: string,
  data: UpdateServiceRequest,
  image?: File | null
): Promise<ServiceOffering> => {
  const formData = buildServiceFormData(data, image);
  const response = await api.patch<ServiceOffering>(`${API_URL}/${id}`, formData);
  return response.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
