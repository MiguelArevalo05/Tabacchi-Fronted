import type { ReactNode } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function AdminModal({
  title,
  children,
  onClose,
  footer,
  size = "md",
}: AdminModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClass[size]} max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminBtnPrimary({
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className="px-4 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminBtnSecondary({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminBtnDanger({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}
