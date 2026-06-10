"use client"
import type React from "react"
import { useState } from "react"
import Input from "@/app/components/atoms/Atoms-login/Input"
import Button from "@/app/components/atoms/Atoms-login/Button"
import { ButtonProps } from "@/components/ui/button"

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  loading: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    credentials: "", // Error general de credenciales inválidas
  })
  
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  // Validación de formato de email
  const validateEmail = (email: string): string => {
    if (!email) {
      return "El correo electrónico es requerido"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Por favor, ingresa un correo electrónico válido"
    }
    return ""
  }

  // Validación de contraseña
  const validatePassword = (password: string): string => {
    if (!password) {
      return "La contraseña es requerida"
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Limpiar errores al escribir
    setErrors((prev) => ({ 
      ...prev, 
      [name]: "", 
      credentials: "" // Limpiar error de credenciales inválidas
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    
    // Validar el campo cuando pierde el foco
    if (name === "email") {
      const emailError = validateEmail(value)
      setErrors((prev) => ({ ...prev, email: emailError }))
    } else if (name === "password") {
      const passwordError = validatePassword(value)
      setErrors((prev) => ({ ...prev, password: passwordError }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Marcar todos los campos como tocados
    setTouched({ email: true, password: true })
    
    // Validar todos los campos
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    
    // Si hay errores de validación, mostrarlos y no enviar
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        credentials: "",
      })
      return
    }
    
    // Limpiar errores previos
    setErrors({ email: "", password: "", credentials: "" })
    
    // Intentar hacer login
    const result = await onSubmit(formData.email, formData.password)
    
    if (!result.success) {
      // Error de credenciales inválidas del servidor
      setErrors({
        email: "",
        password: "",
        credentials: result.message || "Credenciales inválidas. Por favor, verifica tu correo y contraseña.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mensaje de error general de credenciales */}
      {errors.credentials && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error de inicio de sesión</h3>
              <p className="text-sm text-red-700 mt-1">{errors.credentials}</p>
            </div>
          </div>
        </div>
      )}

      <Input
        type="email"
        name="email"
        label="Correo electrónico"
        placeholder="usuario123@ejemplo.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : ""}
        required
        autoComplete="email"
      />

      <Input
        type="password"
        name="password"
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : ""}
        required
        autoComplete="current-password"
      />

      <div className="flex justify-center">
        <Button type="submit" disabled={loading} variant="primary">
          Iniciar sesión
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
export type { ButtonProps }