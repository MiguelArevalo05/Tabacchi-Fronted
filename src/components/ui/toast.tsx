"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface ToastProps {
    type: "success" | "error"
    message: string
    onClose: () => void
    duration?: number
}

export function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    const isSuccess = type === "success"
    const bgColor = isSuccess ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
    const textColor = isSuccess ? "text-emerald-800" : "text-red-800"
    const iconColor = isSuccess ? "text-emerald-600" : "text-red-600"

    return (
        <div
            className={`fixed top-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 max-w-sm z-50`}
        >
            {isSuccess ? (
                <CheckCircle className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
            ) : (
                <XCircle className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
            )}
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
    )
}
