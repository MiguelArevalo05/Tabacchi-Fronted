"use client"

import type React from "react"
import Link from "next/link"
import AuthLayout from "@/app/components/organisms/Organisms-login/AuthLayout"
import LoginForm from "@/app/components/molecules/Molecules-login/LoginForm"

interface LoginTemplateProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  loading: boolean
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({ onLogin, loading }) => {
  return (
    <AuthLayout>
      <LoginForm onSubmit={onLogin} loading={loading} />
      <p className="text-center text-sm text-slate-500 mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-blue-700 font-medium hover:underline">
          Regístrate aquí
        </Link>
      </p>
      <p className="text-center text-sm text-slate-500 mt-2">
        <Link href="/landing" className="text-slate-500 hover:text-blue-700">
          Volver a la tienda
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginTemplate
