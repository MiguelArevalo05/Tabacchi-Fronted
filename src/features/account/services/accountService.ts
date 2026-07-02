import api from "@/lib/api";
import type {
  UpdateAccountProfileRequest,
  UserAccountProfile,
} from "@/features/account/types/account";

export const updateAccountProfile = async (
  data: UpdateAccountProfileRequest
): Promise<UserAccountProfile> => {
  const response = await api.patch<UserAccountProfile>("/auth/profile", data);
  return response.data;
};
