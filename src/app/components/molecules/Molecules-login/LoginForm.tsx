"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

interface LoginFormProps {
  onSubmit: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    credentials: "",
  });
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (email: string): string => {
    if (!email) return "El correo electrónico es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, ingresa un correo electrónico válido";
    }
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "La contraseña es requerida";
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", credentials: "" }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        credentials: "",
      });
      return;
    }

    setErrors({ email: "", password: "", credentials: "" });
    const result = await onSubmit(formData.email, formData.password);

    if (!result.success) {
      setErrors({
        email: "",
        password: "",
        credentials:
          result.message ||
          "Credenciales inválidas. Por favor, verifica tu correo y contraseña.",
      });
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#001a3a]/20 focus:border-[#001a3a]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.credentials && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errors.credentials}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="email"
            type="email"
            name="email"
            placeholder="ejemplo@empresa.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            className={`${inputBase} ${
              touched.email && errors.email
                ? "border-red-400"
                : "border-slate-200"
            }`}
          />
        </div>
        {touched.email && errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="current-password"
            className={`${inputBase} pr-10 ${
              touched.password && errors.password
                ? "border-red-400"
                : "border-slate-200"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-slate-300 text-[#001a3a] focus:ring-[#001a3a]"
          />
          Recordarme
        </label>
        <button
          type="button"
          className="text-[#1e4d8c] hover:underline font-medium"
          onClick={() =>
            alert("Contacta a tu administrador para restablecer tu contraseña.")
          }
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#001a3a] text-white text-sm font-semibold hover:bg-[#002855] disabled:opacity-60 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
};

export default LoginForm;
