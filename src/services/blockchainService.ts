import api from "./interceptor";
import type {
  BlockchainBlock,
  BlockchainValidationResult,
  DeleteOrderHistoryResult,
  OrderVerificationResult,
} from "@/types/blockchain";

const API_URL = "/blockchain";

export const getBlockchain = async (): Promise<BlockchainBlock[]> => {
  const response = await api.get<BlockchainBlock[]>(API_URL);
  return response.data;
};

export const validateBlockchain = async (): Promise<BlockchainValidationResult> => {
  const response = await api.get<BlockchainValidationResult>(
    `${API_URL}/validate`
  );
  return response.data;
};

export const getOrderBlockchain = async (
  orderId: string
): Promise<BlockchainBlock[]> => {
  const response = await api.get<BlockchainBlock[]>(
    `${API_URL}/order/${orderId}`
  );
  return response.data;
};

export const verifyOrderBlockchain = async (
  orderId: string
): Promise<OrderVerificationResult> => {
  const response = await api.get<OrderVerificationResult>(
    `${API_URL}/order/${orderId}/verify`
  );
  return response.data;
};

export const deleteOrderBlockchainHistory = async (
  orderId: string
): Promise<DeleteOrderHistoryResult> => {
  const response = await api.delete<DeleteOrderHistoryResult>(
    `${API_URL}/order/${orderId}`
  );
  return response.data;
};
