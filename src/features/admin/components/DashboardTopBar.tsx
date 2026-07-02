"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Inicio",
  "/admin/productos": "Productos",
  "/admin/categorias": "Categorías",
  "/admin/servicios": "Servicios",
  "/admin/ordenes": "Órdenes",
  "/admin/blockchain": "Blockchain",
  "/admin/usuarios": "Usuarios",
  "/admin/perfiles": "Perfiles",
  "/admin/privilegios": "Privilegios",
  "/admin/pagos": "Pagos Yape / Plin",
};

export function DashboardTopBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = PAGE_TITLES[pathname] ?? "Panel";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">
            Administración
          </p>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/landing"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 border border-slate-200 rounded-lg hover:border-blue-200 transition-colors"
          >
            Ver tienda
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          {user && (
            <span className="text-sm text-slate-500 hidden md:inline">
              {user.fullName || user.email}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
