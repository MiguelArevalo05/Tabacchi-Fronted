"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isAdminUser } from "@/features/auth/utils/auth";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (!isAdminUser(user)) {
      router.replace("/landing");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Cargando...
      </div>
    );
  }

  if (!user || !isAdminUser(user)) return null;

  return <>{children}</>;
}
