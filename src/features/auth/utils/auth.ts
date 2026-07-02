export const ADMIN_MODULES = [
  "product",
  "service",
  "order",
  "profile",
  "privilege",
] as const;

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string | null;
  shippingAddress?: string | null;
  isSuperAdmin?: boolean;
  profiles?: {
    id: string;
    name: string;
    privileges?: { module: string; action: string }[];
  }[];
}

export function isAdminUser(user: AuthUser | null): boolean {
  if (!user) return false;
  if (user.isSuperAdmin) return true;

  return (
    user.profiles?.some((profile) =>
      profile.privileges?.some((priv) =>
        ADMIN_MODULES.includes(priv.module as (typeof ADMIN_MODULES)[number])
      )
    ) ?? false
  );
}

export function getPostLoginRedirect(
  user: AuthUser,
  redirectTo?: string
): string {
  const target = redirectTo || "/landing";

  if (target.startsWith("/admin") || target.startsWith("/dashboard")) {
    return isAdminUser(user) ? target : "/landing";
  }

  return target;
}
