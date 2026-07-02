"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function useRequireAuth(redirectPath: string) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, loading, router, redirectPath]);

  return { user, loading };
}
