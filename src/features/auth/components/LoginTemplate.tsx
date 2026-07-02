"use client";

import type React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";

interface LoginTemplateProps {
  onLogin: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
  redirectTo?: string;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({
  onLogin,
  loading,
  redirectTo = "/landing",
}) => {
  const registerHref = `/register?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <AuthLayout>
      <LoginForm onSubmit={onLogin} loading={loading} />
      <div className="mt-6 rounded-xl border border-[#d71920]/20 bg-red-50/70 p-4 sm:p-5">
        <p className="text-center text-sm font-semibold text-[#001a3a]">
          ¿Aún no tienes una cuenta?
        </p>
        <p className="mt-1 text-center text-xs text-slate-600">
          Regístrate gratis para comprar productos y gestionar tus órdenes.
        </p>
        <Link
          href={registerHref}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#d71920] bg-white px-4 py-2.5 text-sm font-bold text-[#d71920] shadow-sm transition-colors hover:bg-[#d71920] hover:text-white"
        >
          <UserPlus className="h-4 w-4" />
          Crear cuenta
        </Link>
      </div>
      <p className="text-center text-sm text-slate-400 mt-4">
        <Link href="/landing" className="hover:text-[#1e4d8c] transition-colors">
          Volver a la tienda
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginTemplate;
