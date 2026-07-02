"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Package, User } from "lucide-react";

import StorePageShell from "@/components/layout/StorePageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/cuenta", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/cuenta/perfil", label: "Mis datos", icon: User },
  { href: "/cuenta/ordenes", label: "Mis órdenes", icon: Package },
];

interface UserAccountShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function UserAccountShell({
  children,
  title,
  description,
}: UserAccountShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <StorePageShell showTrustBadges={false}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-600">
            Mi cuenta
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#17245c] sm:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{description}</p>
          ) : null}
          {user?.email ? (
            <p className="mt-1 text-sm text-slate-500">Sesión: {user.email}</p>
          ) : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                      active
                        ? "bg-[#17245c] text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#17245c]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start gap-3 font-bold text-slate-600"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </aside>

          <div className="min-h-[28rem]">{children}</div>
        </div>
      </div>
    </StorePageShell>
  );
}
