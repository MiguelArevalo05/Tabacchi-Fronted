import api from "@/lib/api";
import type {
  AddCartItemRequest,
  Cart,
  UpdateCartItemRequest,
} from "@/features/products/types/ecommerce";

const API_URL = "/cart";

export const getCart = async (): Promise<Cart> => {
  const response = await api.get<Cart>(API_URL);
  return response.data;
};

export const addCartItem = async (data: AddCartItemRequest): Promise<Cart> => {
  const response = await api.post<Cart>(`${API_URL}/items`, data);
  return response.data;
};

export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemRequest
): Promise<Cart> => {
  const response = await api.patch<Cart>(`${API_URL}/items/${itemId}`, data);
  return response.data;
};

export const removeCartItem = async (itemId: string): Promise<Cart> => {
  const response = await api.delete<Cart>(`${API_URL}/items/${itemId}`);
  return response.data;
};

export const clearCart = async (): Promise<Cart> => {
  const response = await api.delete<Cart>(API_URL);
  return response.data;
};
