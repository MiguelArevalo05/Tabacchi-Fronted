import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Solo acepta rutas /uploads/ del backend (ignora URLs externas inválidas) */
export function getUploadImageUrl(path: string | null | undefined): string | null {
  if (!path) return null

  const normalized = path.startsWith("/") ? path : `/${path}`
  if (!normalized.startsWith("/uploads/")) return null

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
  const baseUrl = apiUrl.replace(/\/api\/?$/, "")
  return `${baseUrl}${normalized}`
}

/** Para vistas previas locales (blob:) o imágenes ya subidas */
export function getDisplayImageUrl(
  path: string | null | undefined,
  localPreview?: string | null
): string | null {
  if (localPreview) return localPreview
  return getUploadImageUrl(path)
}
