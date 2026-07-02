export enum DocumentType {
  DNI = "dni",
  RUC = "ruc",
  CE = "ce",
  PASSPORT = "passport",
}

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: DocumentType.DNI, label: "DNI" },
  { value: DocumentType.RUC, label: "RUC" },
  { value: DocumentType.CE, label: "Carné de extranjería" },
  { value: DocumentType.PASSPORT, label: "Pasaporte" },
];

export type CheckoutStep = 1 | 2 | 3 | 4;

export type DeliveryType = "home" | "pickup";

export interface CheckoutCustomerForm {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
}

export interface CheckoutShippingForm {
  deliveryType: DeliveryType;
  department: string;
  province: string;
  district: string;
  address: string;
  reference: string;
  postalCode: string;
  contactPhone: string;
}

export type CheckoutPaymentMethod = "yape" | "plin" | "cash";

export interface CheckoutPaymentForm {
  method: CheckoutPaymentMethod | null;
  proofFile: File | null;
  proofPreview: string | null;
}

export interface CheckoutFormState {
  customer: CheckoutCustomerForm;
  shipping: CheckoutShippingForm;
  payment: CheckoutPaymentForm;
  orderNotes: string;
}
