"use client";

import type React from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import RegisterForm, {
  type RegisterFormData,
} from "@/features/auth/components/RegisterForm";

interface RegisterTemplateProps {
  onRegister: (
    data: RegisterFormData,
  ) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
  redirectTo?: string;
}

const RegisterTemplate: React.FC<RegisterTemplateProps> = ({
  onRegister,
  loading,
  redirectTo = "/landing",
}) => {
  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Regístrate para comprar productos y gestionar tus órdenes"
    >
      <RegisterForm onSubmit={onRegister} loading={loading} />
      <div className="mt-6 rounded-xl border border-[#001a3a]/15 bg-slate-50 p-4 sm:p-5">
        <p className="text-center text-sm font-semibold text-[#001a3a]">
          ¿Ya tienes una cuenta?
        </p>
        <p className="mt-1 text-center text-xs text-slate-600">
          Inicia sesión para acceder a tu historial de compras y órdenes.
        </p>
        <Link
          href={loginHref}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#001a3a] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#002855]"
        >
          <LogIn className="h-4 w-4" />
          Iniciar sesión
        </Link>
      </div>
      <p className="mt-4 text-center text-sm text-slate-400">
        <Link href="/landing" className="transition-colors hover:text-[#1e4d8c]">
          Volver a la tienda
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterTemplate;
