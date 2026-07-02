import api, { setUnauthorizedHandler } from "@/lib/api";
import type { DocumentType } from "@/features/account/types/account";

export interface AuthProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string | null;
  shippingAddress?: string | null;
  documentType?: DocumentType | null;
  documentNumber?: string | null;
  isActive?: boolean;
  isSuperAdmin?: boolean;
  profiles?: AuthProfileRole[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthProfileRole {
  id: string;
  name: string;
  description: string;
  privileges?: AuthPrivilege[];
}

export interface AuthPrivilege {
  id: string;
  module: string;
  action: string;
  description?: string;
  isActive?: boolean;
}

interface LoginResponse {
  user: AuthProfile;
  access_token: string;
}

interface ApiErrorBody {
  message?: string | string[];
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as { response?: { data?: ApiErrorBody } }).response?.data;
    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }
    if (typeof data?.message === "string") {
      return data.message;
    }
  }

  return fallback;
}

export async function getAuthProfile(): Promise<AuthProfile> {
  const response = await api.get<AuthProfile>("/auth/profile");
  return response.data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", { email, password });
  return response.data;
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string
): Promise<void> {
  await api.post("/auth/register", { email, password, fullName });
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function registerUnauthorizedHandler(handler: (() => void) | null): void {
  setUnauthorizedHandler(handler);
}

export { getErrorMessage };
