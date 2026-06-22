"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Store,
  Package,
  Wrench,
  ShoppingBag,
  Settings,
  Users,
  Shield,
  KeyRound,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Link2,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

type MenuItem = {
  path: string;
  icon: React.ReactNode;
  title: string;
  module?: string;
  action?: string;
  submenu: {
    path: string;
    title: string;
    icon: React.ReactNode;
    module: string;
    action: string;
  }[];
};

const menuItems: MenuItem[] = [
  {
    path: "/dashboard/main",
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: "Inicio",
    submenu: [],
  },
  {
    path: "/dashboard/store",
    icon: <Store className="w-5 h-5" />,
    title: "Tienda",
    module: "product",
    action: "read",
    submenu: [
      {
        path: "/dashboard/products",
        title: "Productos",
        icon: <Package className="w-4 h-4" />,
        module: "product",
        action: "read",
      },
      {
        path: "/dashboard/catalog-services",
        title: "Servicios",
        icon: <Wrench className="w-4 h-4" />,
        module: "service",
        action: "read",
      },
      {
        path: "/dashboard/ecommerce-orders",
        title: "Órdenes",
        icon: <ShoppingBag className="w-4 h-4" />,
        module: "order",
        action: "read",
      },
      {
        path: "/dashboard/blockchain",
        title: "Blockchain",
        icon: <Link2 className="w-4 h-4" />,
        module: "order",
        action: "read",
      },
    ],
  },
  {
    path: "/dashboard/management",
    icon: <Settings className="w-5 h-5" />,
    title: "Sistema",
    module: "profile",
    action: "read",
    submenu: [
      {
        path: "/dashboard/users",
        title: "Usuarios",
        icon: <Users className="w-4 h-4" />,
        module: "profile",
        action: "read",
      },
      {
        path: "/dashboard/profiles",
        title: "Perfiles",
        icon: <Shield className="w-4 h-4" />,
        module: "profile",
        action: "read",
      },
      {
        path: "/dashboard/privileges",
        title: "Privilegios",
        icon: <KeyRound className="w-4 h-4" />,
        module: "privilege",
        action: "read",
      },
    ],
  },
];

function getUserInitials(name?: string, email?: string) {
  if (name?.trim()) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? "U";
}

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, checkPrivilege } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const filteredMenu = menuItems
    .map((item) => ({
      ...item,
      submenu: item.submenu.filter((sub) =>
        checkPrivilege(sub.module, sub.action)
      ),
    }))
    .filter(
      (item) =>
        !item.module ||
        checkPrivilege(item.module, item.action ?? "read") ||
        item.submenu.length > 0
    );

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsClient(true);
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    setOpenMenus((prev) => {
      const next = { ...prev };
      menuItems.forEach((item) => {
        if (item.submenu.some((sub) => sub.path === pathname)) {
          next[item.path] = true;
        }
      });
      return next;
    });
  }, [pathname]);

  const navigate = (href: string) => {
    router.push(href);
    if (isMobile) setIsOpen(false);
  };

  const isActive = (path: string) => pathname === path;
  const isGroupActive = (item: MenuItem) =>
    item.submenu.some((sub) => sub.path === pathname);

  return (
    <>
      {isClient && (
        <button
          type="button"
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900 text-white shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {isClient && isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ${
          !isClient
            ? "hidden lg:flex"
            : isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-800/80">
          <Link href="/dashboard/main" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white ring-1 ring-slate-700 shrink-0">
              <Image
                src="/images/taba2.png"
                alt="Grupo Tabacchi"
                fill
                sizes="44px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-semibold">
                Grupo
              </p>
              <p className="text-lg font-black text-white leading-none">TABACCHI</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Panel admin</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Menú
          </p>

          {filteredMenu.map((item) => {
            const groupActive = isGroupActive(item);
            const hasSub = item.submenu.length > 0;

            if (!hasSub) {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-700 text-white shadow-lg shadow-blue-900/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </button>
              );
            }

            return (
              <div key={item.path}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenus((p) => ({ ...p, [item.path]: !p[item.path] }))
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    groupActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openMenus[item.path] ? "rotate-180" : ""}`}
                  />
                </button>

                {openMenus[item.path] && (
                  <div className="mt-1 ml-3 pl-3 border-l border-slate-800 space-y-0.5">
                    {item.submenu.map((sub) => {
                      const active = isActive(sub.path);
                      return (
                        <button
                          key={sub.path}
                          type="button"
                          onClick={() => navigate(sub.path)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                            active
                              ? "bg-blue-700/90 text-white font-medium"
                              : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                          }`}
                        >
                          {sub.icon}
                          {sub.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            href="/landing"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver tienda pública
          </Link>

          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {getUserInitials(user?.fullName, user?.email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || "Usuario"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="hidden lg:block w-72 shrink-0" />
    </>
  );
};
