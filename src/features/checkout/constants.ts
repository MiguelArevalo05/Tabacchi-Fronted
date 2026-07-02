import type { CheckoutStep } from "@/features/checkout/types";

export const CHECKOUT_STEPS: {
  step: CheckoutStep;
  label: string;
  subtitle: string;
}[] = [
  { step: 1, label: "Datos del cliente", subtitle: "Tus datos personales" },
  { step: 2, label: "Información de envío", subtitle: "¿Dónde lo entregamos?" },
  { step: 3, label: "Información de pago", subtitle: "Selecciona tu método" },
  { step: 4, label: "Confirmación", subtitle: "Revisa y confirma tu pedido" },
];
