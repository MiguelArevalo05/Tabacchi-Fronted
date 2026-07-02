export interface UpdateAccountProfileRequest {
  fullName?: string;
  phone?: string;
  shippingAddress?: string;
  documentType?: DocumentType;
  documentNumber?: string;
}

export enum DocumentType {
  DNI = "dni",
  RUC = "ruc",
  CE = "ce",
  PASSPORT = "passport",
}

export interface UserAccountProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string | null;
  shippingAddress?: string | null;
  documentType?: DocumentType | null;
  documentNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
