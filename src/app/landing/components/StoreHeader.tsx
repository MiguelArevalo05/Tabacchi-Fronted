"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const NAV_LINKS = [
  { href: "/landing#inicio", label: "Inicio" },
  { href: "/landing#servicios", label: "Servicios" },
  { href: "/landing#productos", label: "Productos" },
  { href: "/landing#nosotros", label: "Nosotros" },
  { href: "/landing#contacto", label: "Contacto" },
];

function BrandLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <div
      className={`relative shrink-0 rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-slate-200 ${className}`}
    >
      <Image
        src="/images/taba2.png"
        alt="Grupo Tabacchi"
        fill
        sizes="64px"
        className="object-contain p-1.5"
        priority
      />
    </div>
  );
}

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <BrandLogo className="h-12 w-12 sm:h-14 sm:w-14" />
      <div className="leading-tight">
        <p className="text-[11px] uppercase tracking-[0.25em] text-blue-700 font-semibold">
          Grupo
        </p>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          TABACCHI
        </h1>
        <p className="text-xs text-slate-500 font-medium tracking-wide">S.A.C.</p>
      </div>
    </div>
  );
}

export default function StoreHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const { cart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemCount = cart?.itemCount ?? 0;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200"
          : "bg-white/90 backdrop-blur-xl border-b border-slate-200/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/landing"
            className="shrink-0 hover:opacity-90 transition-opacity"
            aria-label="Grupo Tabacchi - Inicio"
          >
            <HeaderBrand />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" asChild className="relative border-blue-200">
              <Link href="/cart">
                <ShoppingCart className="w-4 h-4" />
                Carrito
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {user ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/my-orders">Mis órdenes</Link>
                </Button>
                {isAdmin && (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/main">Panel</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
                <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white">
                  <Link href="/login?redirect=/landing">Iniciar sesión</Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-slate-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" asChild>
              <Link href="/cart">Carrito ({itemCount})</Link>
            </Button>
            {user ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/my-orders">Mis órdenes</Link>
                </Button>
                {isAdmin && (
                  <Button asChild className="bg-blue-700 hover:bg-blue-800">
                    <Link href="/dashboard/main">Panel</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
                <Button asChild className="bg-blue-700 hover:bg-blue-800">
                  <Link href="/login?redirect=/landing">Iniciar sesión</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
