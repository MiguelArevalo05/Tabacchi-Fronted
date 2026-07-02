"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import CategoryNavDropdown from "@/features/categories/components/CategoryNavDropdown";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";

type SectionNavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: SectionNavLink[] = [
  { href: "/landing#inicio", label: "Inicio" },
  { href: "/landing#productos", label: "Productos" },
  { href: "/landing#servicios", label: "Servicios" },
  { href: "/landing#nosotros", label: "Nosotros" },
  { href: "/landing#certificaciones", label: "Certificaciones" },
  { href: "/landing#contacto", label: "Contacto" },
];

const NAV_SECTION_IDS = NAV_LINKS.map((link) => link.href.split("#")[1]).filter(Boolean);

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
  return <BrandLogo light={light} />;
}

export default function StoreHeader({
  transparentOnTop = false,
  embedded = false,
}: {
  transparentOnTop?: boolean;
  embedded?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isOnLanding = pathname === "/landing";
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

  const getScrollMarker = useCallback(() => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const isLg = window.matchMedia("(min-width: 1024px)").matches;
    return rem * (isLg ? 8 : 7) + 16;
  }, []);

  const scrollToSectionElement = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return false;

    window.history.pushState(null, "", `#${sectionId}`);

    const scroll = () => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scroll();
    window.setTimeout(scroll, 200);
    window.setTimeout(scroll, 500);

    setActiveSection(sectionId);
    return true;
  }, []);

  const scrollToHashSection = useCallback(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const scroll = () => {
      const section = document.getElementById(hash);
      if (!section) return false;

      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(hash);
      return true;
    };

    scroll();
    window.setTimeout(scroll, 200);
    window.setTimeout(scroll, 500);
    window.setTimeout(scroll, 900);
  }, []);

  useEffect(() => {
    if (!isOnLanding) {
      setActiveSection("");
      return;
    }

    const updateActiveSection = () => {
      const marker = getScrollMarker();
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

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          scrollToHashSection();
        });
      });
    }

    window.addEventListener("hashchange", updateActiveSection);
    window.addEventListener("hashchange", scrollToHashSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("hashchange", updateActiveSection);
      window.removeEventListener("hashchange", scrollToHashSection);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [isOnLanding, pathname, getScrollMarker, scrollToHashSection]);

  const itemCount = cart?.itemCount ?? 0;

  const navigateToSection = (href: string) => {
    const sectionId = href.split("#")[1];
    if (!sectionId) return;

    if (isOnLanding) {
      scrollToSectionElement(sectionId);
      return;
    }

    router.push(`/landing#${sectionId}`, { scroll: false });
  };

  const navLinkClass = (isActive: boolean) =>
    `relative inline-flex items-center py-2 text-sm font-bold transition-colors hover:text-[#d71920] ${
      transparent ? "text-white" : "text-[#17245c]"
    } ${
      isActive
        ? `after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-full after:rounded-full ${
            transparent ? "after:bg-[#d71920]" : "after:bg-[#17245c]"
          }`
        : ""
    }`;

  const renderNavLink = (link: SectionNavLink, onNavigate?: () => void) => {
    const sectionId = link.href.split("#")[1];
    const isActive = isOnLanding && sectionId === activeSection;

    return (
      <a
        key={link.href}
        href={link.href}
        onClick={(event) => {
          event.preventDefault();
          navigateToSection(link.href);
          onNavigate?.();
        }}
        className={navLinkClass(isActive)}
      >
        {link.label}
      </a>
    );
  };

  return (
    <header
      className={`transition-all duration-300 ${
        embedded ? "relative w-full" : "fixed top-0 left-0 right-0 z-50"
      } ${
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
            {NAV_LINKS.slice(0, 3).map((link) => renderNavLink(link))}
            <Suspense
              fallback={
                <span
                  className={`py-2 text-sm font-bold ${transparent ? "text-white" : "text-[#17245c]"}`}
                >
                  Categorías
                </span>
              }
            >
              <CategoryNavDropdown transparent={transparent} />
            </Suspense>
            {NAV_LINKS.slice(3).map((link) => renderNavLink(link))}
          </nav>

          <div className="hidden shrink-0 items-center gap-5 xl:flex">
            <Button
              variant={user ? "default" : "ghost"}
              size="icon"
              asChild
              className={`relative h-11 w-11 ${
                user
                  ? transparent
                    ? "border border-white/35 bg-white/20 text-white shadow-md hover:bg-white hover:text-[#17245c]"
                    : "bg-[#17245c] text-white shadow-md hover:bg-[#101b47] hover:text-white"
                  : `hover:bg-transparent hover:text-[#d71920] ${
                      transparent ? "text-white" : "text-[#17245c]"
                    }`
              }`}
            >
              <Link href="/carrito" aria-label="Carrito">
                <ShoppingCart className="h-6 w-6 stroke-[2.4]" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d71920] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {user ? (
              <>
                <Button
                  asChild
                  className={`h-12 rounded-md px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(215,25,32,0.28)] ${
                    transparent
                      ? "bg-[#d71920] hover:bg-[#b9151b]"
                      : "bg-[#d71920] hover:bg-[#b9151b]"
                  }`}
                >
                  <Link href="/cuenta">Mi cuenta</Link>
                </Button>
                {isAdmin && (
                  <Button
                    asChild
                    className={`h-12 rounded-md px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,163,74,0.28)] ${
                      transparent
                        ? "bg-[#16a34a] hover:bg-[#15803d]"
                        : "bg-[#16a34a] hover:bg-[#15803d]"
                    }`}
                  >
                    <Link href="/admin">Panel</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button asChild className="h-14 rounded-md bg-[#d71920] px-8 text-sm font-bold text-white shadow-[0_10px_24px_rgba(215,25,32,0.28)] hover:bg-[#b9151b]">
                <Link href="/login?redirect=/landing">Iniciar sesión</Link>
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
          {NAV_LINKS.slice(0, 3).map((link) => {
            const sectionId = link.href.split("#")[1];
            const isActive = isOnLanding && sectionId === activeSection;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  navigateToSection(link.href);
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

          <Suspense fallback={null}>
            <CategoryNavDropdown
              variant="mobile"
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </Suspense>

          {NAV_LINKS.slice(3).map((link) => {
            const sectionId = link.href.split("#")[1];
            const isActive = isOnLanding && sectionId === activeSection;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  navigateToSection(link.href);
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
            <Button
              asChild
              className={`font-bold ${
                user
                  ? "bg-[#17245c] text-white hover:bg-[#101b47]"
                  : "border-[#17245c]/30 text-[#17245c] hover:bg-[#17245c] hover:text-white"
              }`}
              variant={user ? "default" : "outline"}
            >
              <Link href="/carrito">Carrito ({itemCount})</Link>
            </Button>
            {user ? (
              <>
                <Button asChild className="bg-[#d71920] font-bold text-white hover:bg-[#b9151b]">
                  <Link href="/cuenta">Mi cuenta</Link>
                </Button>
                {isAdmin && (
                  <Button asChild className="bg-[#16a34a] font-bold text-white hover:bg-[#15803d]">
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
