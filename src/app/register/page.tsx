"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import StoreHeader from "@/app/landing/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      setError("Completa todos los campos.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const result = await register(form.email, form.password, form.fullName);
    setLoading(false);

    if (result.success) {
      router.push("/login?redirect=/landing&message=registered");
    } else {
      setError(result.message || "Error al registrar");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Crear cuenta</h1>
          <p className="text-slate-600 mb-6 text-sm">
            Regístrate para comprar productos y generar órdenes.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "fullName", label: "Nombre completo", type: "text" },
              { name: "email", label: "Correo electrónico", type: "email" },
              { name: "password", label: "Contraseña", type: "password" },
              { name: "confirmPassword", label: "Confirmar contraseña", type: "password" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.name as keyof typeof form]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 h-11"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login?redirect=/landing" className="text-blue-700 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
