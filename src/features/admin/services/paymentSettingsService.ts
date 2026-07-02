import api from "@/lib/api";
import type { PaymentConfigResponse } from "@/features/checkout/services/paymentConfigService";

const API_URL = "/settings/payment-config";

export interface UpdatePaymentConfigRequest {
  yapePhone: string;
  yapeHolderName: string;
  plinPhone: string;
  plinHolderName: string;
}

export async function getPaymentSettings(): Promise<PaymentConfigResponse> {
  const response = await api.get<PaymentConfigResponse>(API_URL);
  return response.data;
}

export async function updatePaymentSettings(
  data: UpdatePaymentConfigRequest
): Promise<PaymentConfigResponse> {
  const response = await api.patch<PaymentConfigResponse>(API_URL, data);
  return response.data;
}
