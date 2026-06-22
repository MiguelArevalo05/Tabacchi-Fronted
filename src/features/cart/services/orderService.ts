import api from "@/lib/api";
import type {
  CreateOrderRequest,
  EcommerceOrder,
  OrderStatus,
  PaginatedResponse,
  PaginationQuery,
  UpdateOrderStatusRequest,
} from "@/features/products/types/ecommerce";

const API_URL = "/orders";

export const createOrder = async (
  data: CreateOrderRequest
): Promise<EcommerceOrder> => {
  const response = await api.post<EcommerceOrder>(API_URL, data);
  return response.data;
};

export const getMyOrders = async (
  params?: PaginationQuery
): Promise<PaginatedResponse<EcommerceOrder>> => {
  const response = await api.get<PaginatedResponse<EcommerceOrder>>(
    `${API_URL}/my`,
    { params }
  );
  return response.data;
};

export const getOrderById = async (id: string): Promise<EcommerceOrder> => {
  const response = await api.get<EcommerceOrder>(`${API_URL}/${id}`);
  return response.data;
};

export const getOrdersAdmin = async (
  params?: PaginationQuery & { status?: OrderStatus }
): Promise<PaginatedResponse<EcommerceOrder>> => {
  const response = await api.get<PaginatedResponse<EcommerceOrder>>(
    `${API_URL}/admin/all`,
    { params }
  );
  return response.data;
};

export const getOrderAdminById = async (
  id: string
): Promise<EcommerceOrder> => {
  const response = await api.get<EcommerceOrder>(`${API_URL}/admin/${id}`);
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  data: UpdateOrderStatusRequest
): Promise<EcommerceOrder> => {
  const response = await api.patch<EcommerceOrder>(
    `${API_URL}/${id}/status`,
    data
  );
  return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
