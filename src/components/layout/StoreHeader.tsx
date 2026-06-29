"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";

const NAV_LINKS = [
  { href: "/landing#inicio", label: "Inicio" },
  { href: "/landing#productos", label: "Productos", hasMenu: true },
  { href: "/landing#servicios", label: "Servicios", hasMenu: true },
  { href: "/landing#nosotros", label: "Nosotros" },
  { href: "/landing#certificaciones", label: "Certificaciones" },
  { href: "/landing#contacto", label: "Contacto" },
];

const NAV_SECTION_IDS = NAV_LINKS.map((link) => link.href.split("#")[1]).filter(
  Boolean
);

function BrandLogo({
  className = "h-16 w-56 sm:h-20 sm:w-64 lg:h-24 lg:w-72",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <Image
        src={light ? "/images/logo-footer.png" : "/images/logo-navbar.png"}
        alt="Grupo Tabacchi"
        fill
        sizes="(min-width: 1024px) 288px, 256px"
        className="object-contain object-left"
        priority
      />
    </div>
  );
}

export function HeaderBrand({ light = false }: { light?: boolean }) {
  return (
    <BrandLogo light={light} />
  );
}

export default function StoreHeader({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const { user, isAdmin } = useAuth();
  const { cart } = useCart();
  const transparent = transparentOnTop && !scrolled && !mobileMenuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = (document.querySelector("header")?.clientHeight ?? 112) + 16;
      const currentSection =
        NAV_SECTION_IDS.find((sectionId) => {
          const element = document.getElementById(sectionId);
          if (!element) return false;

          const rect = element.getBoundingClientRect();
          return rect.top <= marker && rect.bottom > marker;
        }) ?? "inicio";

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("hashchange", updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("hashchange", updateActiveSection);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  const itemCount = cart?.itemCount ?? 0;

  const scrollToSection = (href: string) => {
    const sectionId = href.split("#")[1];
    if (!sectionId) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerHeight = document.querySelector("header")?.clientHeight ?? 112;
    const top =
      section.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

    window.history.pushState(null, "", `#${sectionId}`);
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    setActiveSection(sectionId);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : scrolled
          ? "bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between gap-6 lg:h-28">
          <Link
            href="/landing"
            className="shrink-0 transition-opacity hover:opacity-90"
            aria-label="Grupo Tabacchi - Inicio"
          >
            <HeaderBrand light={transparent} />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 xl:flex">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.split("#")[1];
              const isActive = sectionId === activeSection;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`group relative inline-flex items-center gap-1 py-2 text-sm font-bold transition-colors hover:text-[#d71920] ${
                    transparent ? "text-white" : "text-[#17245c]"
                  } ${
                    isActive
                      ? `after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-full after:rounded-full ${
                          transparent ? "after:bg-[#d71920]" : "after:bg-[#17245c]"
                        }`
                      : ""
                  }`}
                >
                  {link.label}
                  {link.hasMenu && (
                    <ChevronDown className="h-3.5 w-3.5 stroke-[3] transition-transform group-hover:translate-y-0.5" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-5 xl:flex">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`relative h-11 w-11 hover:bg-transparent hover:text-[#d71920] ${
                transparent ? "text-white" : "text-[#17245c]"
              }`}
            >
              <Link href="/carrito" aria-label="Carrito">
                <ShoppingCart className="h-6 w-6 stroke-[2.4]" />
                {itemCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#d71920] text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {user ? (
              <>
                <Button
                  variant="outline"
                  asChild
                  className={`font-bold ${
                    transparent
                      ? "border-white/25 bg-white/5 text-white hover:bg-white/[0.12] hover:text-white"
                      : "border-[#17245c]/20 text-[#17245c]"
                  }`}
                >
                  <Link href="/my-orders">Mis órdenes</Link>
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    asChild
                    className={`font-bold ${
                      transparent
                        ? "border-white/25 bg-white/5 text-white hover:bg-white/[0.12] hover:text-white"
                        : "border-[#17245c]/20 text-[#17245c]"
                    }`}
                  >
                    <Link href="/admin">Panel</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button asChild className="h-14 rounded-md bg-[#d71920] px-8 text-sm font-bold text-white shadow-[0_10px_24px_rgba(215,25,32,0.28)] hover:bg-[#b9151b]">
                <Link href="/login?redirect=/landing">Cotizar ahora</Link>
              </Button>
            )}
          </div>

          <button
            type="button"
            className={`rounded-md p-2 shadow-sm transition-colors xl:hidden ${
              transparent
                ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border border-slate-200 bg-white text-[#17245c] hover:bg-slate-50"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-4 mb-4 space-y-2 rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.12)] xl:hidden">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.split("#")[1];
            const isActive = sectionId === activeSection;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(link.href);
                  setMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-3 py-2.5 font-bold transition-colors hover:bg-red-50 hover:text-[#d71920] ${
                  isActive
                    ? "bg-blue-50 text-[#17245c] ring-1 ring-blue-100"
                    : "text-[#17245c]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" asChild className="font-bold text-[#17245c]">
              <Link href="/carrito">Carrito ({itemCount})</Link>
            </Button>
            {user ? (
              <>
                <Button variant="outline" asChild className="font-bold text-[#17245c]">
                  <Link href="/my-orders">Mis órdenes</Link>
                </Button>
                {isAdmin && (
                  <Button asChild className="bg-[#d71920] font-bold hover:bg-[#b9151b]">
                    <Link href="/admin">Panel</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="font-bold text-[#17245c]">
                  <Link href="/register">Registrarse</Link>
                </Button>
                <Button asChild className="bg-[#d71920] font-bold hover:bg-[#b9151b]">
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
