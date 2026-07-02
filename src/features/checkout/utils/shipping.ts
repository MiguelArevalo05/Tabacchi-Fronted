import type { CheckoutShippingForm } from "@/features/checkout/types";

const DELIVERY_TYPE_LABELS = {
  home: "Entrega a domicilio",
  pickup: "Recojo en tienda / almacén",
} as const;

export function getDeliveryTypeLabel(type: CheckoutShippingForm["deliveryType"]): string {
  return DELIVERY_TYPE_LABELS[type];
}

export function formatShippingAddress(form: CheckoutShippingForm): string {
  if (form.deliveryType === "pickup") {
    return `[${DELIVERY_TYPE_LABELS.pickup}]`;
  }

  const lines = [
    `[${DELIVERY_TYPE_LABELS.home}]`,
    `${form.district}, ${form.province}, ${form.department}`,
    form.address.trim(),
  ];

  if (form.reference.trim()) {
    lines.push(`Ref: ${form.reference.trim()}`);
  }

  if (form.postalCode.trim()) {
    lines.push(`CP: ${form.postalCode.trim()}`);
  }

  return lines.join("\n");
}

export function formatShippingSummary(form: CheckoutShippingForm): string {
  if (form.deliveryType === "pickup") {
    return "Recojo en tienda / almacén";
  }

  const parts = [
    `${form.district}, ${form.province}, ${form.department}`,
    form.address.trim(),
  ];

  if (form.reference.trim()) {
    parts.push(form.reference.trim());
  }

  return parts.filter(Boolean).join(" — ");
}

export const DEFAULT_SHIPPING_FORM: CheckoutShippingForm = {
  deliveryType: "home",
  department: "Lima",
  province: "Lima",
  district: "Lurín",
  address: "",
  reference: "",
  postalCode: "",
  contactPhone: "",
};
