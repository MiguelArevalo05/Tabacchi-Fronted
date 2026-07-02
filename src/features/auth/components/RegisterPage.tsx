"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import RegisterTemplate from "@/features/auth/components/RegisterTemplate";
import type { RegisterFormData } from "@/features/auth/components/RegisterForm";

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/landing";
  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;
  const [loading, setLoading] = useState(false);

  const handleRegister = useCallback(
    async (data: RegisterFormData) => {
      setLoading(true);
      const result = await register(
        data.email,
        data.password,
        data.fullName.trim(),
      );
      setLoading(false);

      if (result.success) {
        router.push(`${loginHref}&message=registered`);
        return { success: true };
      }

      return {
        success: false,
        message: result.message || "Error al registrar",
      };
    },
    [register, router, loginHref],
  );

  return (
    <RegisterTemplate
      onRegister={handleRegister}
      loading={loading}
      redirectTo={redirectTo}
    />
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
