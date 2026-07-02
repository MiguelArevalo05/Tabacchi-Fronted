"use client";

import type React from "react";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (
    data: RegisterFormData,
  ) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

type FormField = keyof RegisterFormData;

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<
    Record<FormField | "form", string>
  >({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    form: "",
  });
  const [touched, setTouched] = useState<Record<FormField, boolean>>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateFullName = (fullName: string): string => {
    if (!fullName.trim()) return "El nombre completo es requerido";
    if (fullName.trim().length < 3) {
      return "Ingresa al menos 3 caracteres";
    }
    return "";
  };

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

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ): string => {
    if (!confirmPassword) return "Confirma tu contraseña";
    if (password !== confirmPassword) return "Las contraseñas no coinciden";
    return "";
  };

  const getFieldError = (field: FormField, value: string): string => {
    switch (field) {
      case "fullName":
        return validateFullName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(formData.password, value);
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as FormField;

    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      setErrors((current) => {
        const nextErrors = { ...current, [field]: "", form: "" };

        if (field !== "confirmPassword" && touched.confirmPassword) {
          nextErrors.confirmPassword = validateConfirmPassword(
            field === "password" ? value : next.password,
            next.confirmPassword,
          );
        }

        return nextErrors;
      });

      return next;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as FormField;

    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: getFieldError(field, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );

    if (fullNameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        fullName: fullNameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        form: "",
      });
      return;
    }

    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      form: "",
    });

    const result = await onSubmit(formData);

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        form: result.message || "No se pudo crear la cuenta. Intenta de nuevo.",
      }));
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#001a3a]/20 focus:border-[#001a3a]";

  const renderFieldError = (field: FormField) =>
    touched[field] && errors[field] ? (
      <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <div>
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Nombre completo
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Ej. Juan Pérez"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="name"
            className={`${inputBase} ${
              touched.fullName && errors.fullName
                ? "border-red-400"
                : "border-slate-200"
            }`}
          />
        </div>
        {renderFieldError("fullName")}
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="ejemplo@empresa.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            className={`${inputBase} ${
              touched.email && errors.email ? "border-red-400" : "border-slate-200"
            }`}
          />
        </div>
        {renderFieldError("email")}
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
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
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {renderFieldError("password")}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Confirmar contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            className={`${inputBase} pr-10 ${
              touched.confirmPassword && errors.confirmPassword
                ? "border-red-400"
                : "border-slate-200"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={
              showConfirmPassword
                ? "Ocultar confirmación"
                : "Mostrar confirmación"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {renderFieldError("confirmPassword")}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#001a3a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#002855] disabled:opacity-60"
      >
        <UserPlus className="h-4 w-4" />
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
};

export default RegisterForm;
