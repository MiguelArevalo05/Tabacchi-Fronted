import api from "@/lib/api";

export async function getUsers() {
  const response = await api.get("/auth/users");
  return response.data;
}

export async function createUser(data: {
  email: string;
  fullName: string;
  password: string;
  isSuperAdmin: boolean;
}) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function deleteUser(userId: string) {
  await api.delete(`/profiles-privileges/users/${userId}`);
}

export async function assignUserProfile(userId: string, profileId: string) {
  await api.post(`/profiles-privileges/users/${userId}/profile/${profileId}`);
}

export async function removeUserProfile(userId: string, profileId: string) {
  await api.delete(`/profiles-privileges/users/${userId}/profile/${profileId}`);
}

export async function updateUserSuperAdmin(userId: string, isSuperAdmin: boolean) {
  const response = await api.put(`/auth/users/${userId}/super-admin`, { isSuperAdmin });
  return response.data;
}

export async function getProfiles() {
  const response = await api.get("/profiles-privileges/profiles");
  return response.data;
}

export async function createProfile(data: {
  name: string;
  description: string;
  privilegeIds: string[];
}) {
  const response = await api.post("/profiles-privileges/profiles", data);
  return response.data;
}

export async function updateProfile(
  id: string,
  data: { name: string; description: string; privilegeIds?: string[] }
) {
  const response = await api.patch(`/profiles-privileges/profiles/${id}`, data);
  return response.data;
}

export async function deleteProfile(id: string) {
  await api.delete(`/profiles-privileges/profiles/${id}`);
}

export async function removeProfilePrivilege(profileId: string, privilegeId: string) {
  await api.delete(`/profiles-privileges/profiles/${profileId}/privilege/${privilegeId}`);
}

export async function getPrivileges() {
  const response = await api.get("/profiles-privileges/privileges");
  return response.data;
}

export async function createPrivilege(data: {
  module: string;
  action: string;
  description: string;
}) {
  const response = await api.post("/profiles-privileges/privileges", data);
  return response.data;
}

export async function updatePrivilege(
  id: number,
  data: {
    module?: string;
    action?: string;
    description?: string;
    isActive?: boolean;
  }
) {
  const response = await api.patch(`/profiles-privileges/privileges/${id}`, data);
  return response.data;
}

export async function deletePrivilege(id: number) {
  await api.delete(`/profiles-privileges/privileges/${id}`);
}
