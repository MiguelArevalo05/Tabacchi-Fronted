import type { CheckoutPaymentForm, CheckoutPaymentMethod } from "@/features/checkout/types";

export const PAYMENT_METHOD_LABELS: Record<CheckoutPaymentMethod, string> = {
  yape: "Yape",
  plin: "Plin",
  cash: "Pago en efectivo",
};

export function getPaymentMethodLabel(method: CheckoutPaymentMethod | null): string {
  if (!method) return "Sin seleccionar";
  return PAYMENT_METHOD_LABELS[method];
}

export function requiresPaymentProof(method: CheckoutPaymentMethod | null): boolean {
  return method === "yape" || method === "plin";
}

export function validatePaymentForm(form: CheckoutPaymentForm): string | null {
  if (!form.method) {
    return "Selecciona un método de pago.";
  }

  if (requiresPaymentProof(form.method) && !form.proofFile) {
    return "Debes subir la captura o foto del comprobante de pago.";
  }

  return null;
}

export const DEFAULT_PAYMENT_FORM: CheckoutPaymentForm = {
  method: null,
  proofFile: null,
  proofPreview: null,
};
