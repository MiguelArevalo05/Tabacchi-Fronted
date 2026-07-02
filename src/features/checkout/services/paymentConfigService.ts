import api from "@/lib/api";

export interface WalletPaymentConfig {
  phone: string;
  holderName: string;
}

export interface PaymentConfigResponse {
  yape: WalletPaymentConfig;
  plin: WalletPaymentConfig;
}

export async function getPaymentConfig(): Promise<PaymentConfigResponse> {
  const response = await api.get<PaymentConfigResponse>("/settings/payment-config");
  return response.data;
}
