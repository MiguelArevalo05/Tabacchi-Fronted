"use client";

import {
  BadgeCheck,
  Bug,
  ChevronRight,
  CreditCard,
  Droplets,
  Headphones,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

import StoreHeader from "@/components/layout/StoreHeader";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";
import { getProducts } from "@/features/products/services/productService";
import { getServices } from "@/features/products/services/serviceOfferingService";
import {
  CATALOG_AVAILABILITY_CONFIG,
  formatPrice,
  getProductBadgeOption,
  isProductPurchasable,
} from "@/features/products/types/ecommerce";
import type { Product, ServiceOffering } from "@/features/products/types/ecommerce";
import { getUploadImageUrl } from "@/lib/utils";

const FALLBACK_IMAGES = [
  "/images/carrusel-1.webp",
  "/images/carrusel-2.webp",
  "/images/carrusel-3.webp",
  "/images/carrusel-4.webp",
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Seguridad garantizada",
    description: "Protocolos certificados",
  },
  {
    icon: Users,
    title: "Personal especializado",
    description: "Técnicos certificados",
  },
  {
    icon: BadgeCheck,
    title: "Cumplimiento normativo",
    description: "Normas y reglamentos",
  },
];

const SERVICE_ICONS: LucideIcon[] = [ShieldCheck, Bug, Droplets, Wrench];

const SERVICE_CARD_ICON_COLORS = [
  "text-red-500",
  "text-amber-400",
  "text-blue-600",
  "text-red-500",
];

const BENEFITS = [
  {
    icon: Truck,
    title: "Envíos a todo el Perú",
    description: "Despacho rápido y seguro",
  },
  {
    icon: ShieldCheck,
    title: "Garantía en todos nuestros productos",
    description: "Respaldo técnico certificado",
  },
  {
    icon: Headphones,
    title: "Asesoría técnica especializada",
    description: "Acompañamiento antes y después",
  },
  {
    icon: CreditCard,
    title: "Métodos de pago 100% seguros",
    description: "Compra protegida",
  },
];

const FOOTER_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#productos", label: "Productos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

function LogoMark({ className = "h-16 w-56" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/logo-footer.png"
        alt="Grupo Tabacchi"
        fill
        sizes="224px"
        className="object-contain object-left"
        priority
      />
    </div>
  );
}

function getFallbackImage(index: number) {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function getProductImage(product: Product, index: number) {
  return getUploadImageUrl(product.imageUrl) ?? getFallbackImage(index);
}

function getServiceImage(service: ServiceOffering, index: number) {
  return getUploadImageUrl(service.imageUrl) ?? getFallbackImage(index + 1);
}

function getProductDiscount(product: Product): number | null {
  if (product.discountPercentage) return product.discountPercentage;
  if (!product.originalPrice) return null;

  const price = Number(product.price);
  const originalPrice = Number(product.originalPrice);
  if (!price || !originalPrice || originalPrice <= price) return null;

  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function LandingContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [showAllServices, setShowAllServices] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    Promise.all([getServices({ limit: 20 }), getProducts({ limit: 20 })])
      .then(([servicesRes, productsRes]) => {
        setServices(servicesRes.data);
        setProducts(productsRes.data);
      })
      .catch(() => {
        setServices([]);
        setProducts([]);
      })
      .finally(() => setLoadingCatalog(false));
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      router.push("/login?redirect=/landing");
      return;
    }

    setAddingId(`product-${productId}`);
    const ok = await addToCart(productId, 1);
    setAddingId(null);
    setToast({
      type: ok ? "success" : "error",
      message: ok ? "Producto agregado al carrito." : "No se pudo agregar al carrito.",
    });
  };

  const visibleServices = showAllServices ? services : services.slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-900 scroll-smooth">
      <StoreHeader transparentOnTop />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <section
        id="inicio"
        className="relative box-border flex min-h-[100svh] scroll-mt-28 overflow-hidden bg-[#061121] bg-cover bg-[position:54%_center] bg-no-repeat pt-28 text-white sm:bg-[position:58%_center] lg:min-h-screen lg:scroll-mt-32 lg:bg-[position:48%_center] lg:pt-32"
        style={{ backgroundImage: "url('/images/hero2.webp')" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,24,0.86)_0%,rgba(5,14,32,0.58)_34%,rgba(5,14,32,0.16)_62%,rgba(5,14,32,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_43%,rgba(215,25,32,0.14),transparent_24%),radial-gradient(circle_at_80%_38%,rgba(56,189,248,0.1),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#061121]/85 to-transparent" />

        <div className="relative mx-auto flex w-full max-w-7xl items-center px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-0">
          <div className="relative z-10 max-w-[640px] py-8 lg:py-12">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.42em] text-red-500">
              Seguridad, control y saneamiento industrial
            </p>
            <h1 className="max-w-[610px] text-4xl font-black leading-[1.03] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)] sm:text-5xl lg:text-[3.85rem]">
              Protegemos lo que más valoras:{" "}
              <span className="text-red-500">tu vida</span> y tu empresa
            </h1>
            <p className="mt-6 max-w-[560px] text-sm leading-7 text-white/[0.84] sm:text-base">
              Soluciones integrales en extintores, fumigación y limpieza de tanques
              con altos estándares de calidad y seguridad.
            </p>

            <div className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-3">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] backdrop-blur">
                    <item.icon className="h-7 w-7 stroke-[2]" />
                  </span>
                  <span>
                    <span className="block text-sm font-black leading-6 text-white">{item.title}</span>
                    <span className="mt-1.5 block text-xs leading-5 text-white/70">{item.description}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button asChild className="h-14 rounded-md bg-[#d71920] px-8 text-sm font-black text-white shadow-[0_16px_34px_rgba(215,25,32,0.38)] hover:bg-[#b9151b]">
                <a href="#productos">
                  Ver productos y servicios
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-md border-white/[0.22] bg-white/5 px-8 text-sm font-black text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] backdrop-blur hover:bg-white/[0.12] hover:text-white"
              >
                <a href="#contacto">
                  Cotizar servicio
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

        </div>
      </section>

      <section id="productos" className="relative scroll-mt-28 overflow-hidden bg-white py-14 lg:scroll-mt-32 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(37,99,235,0.16),transparent_32%),radial-gradient(circle_at_88%_88%,rgba(220,38,38,0.12),transparent_36%),linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-600">
              Productos destacados
            </p>
            <h2 className="mt-3 text-2xl font-black text-blue-950 sm:text-3xl lg:text-4xl">
              Equipos certificados para tu seguridad
            </h2>
          </div>

          {loadingCatalog ? (
            <p className="text-center text-slate-500">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-slate-500">No hay productos disponibles por el momento.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {products.slice(0, 5).map((product, index) => {
                const addingKey = `product-${product.id}`;
                const image = getProductImage(product, index);
                const discount = getProductDiscount(product);
                const badge = getProductBadgeOption(product.badgeLabel, product.badgeColor);

                return (
                  <article key={product.id} className="group flex min-h-[420px] flex-col rounded-[1.45rem] bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/70 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
                    <div className="relative h-56 overflow-hidden rounded-[1.15rem] bg-gradient-to-br from-slate-50 to-slate-100">
                      {badge ? (
                        <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-xs font-semibold ${badge.className}`}>
                          {badge.label}
                        </span>
                      ) : null}
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1280px) 33vw, 20vw"
                        className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                      <h3 className="text-lg font-black leading-6 text-slate-950">
                        {product.name}
                      </h3>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                          <span className="text-xl font-black text-slate-950">{formatPrice(product.price)}</span>
                          {product.originalPrice ? (
                            <span className="pb-1 text-sm font-semibold text-slate-300 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          ) : null}
                        </div>
                        {discount ? (
                          <span className="shrink-0 rounded-lg bg-indigo-100 px-3 py-2 text-xs font-black text-indigo-600">
                            {discount}% OFF
                          </span>
                        ) : null}
                      </div>

                      {!isProductPurchasable(product) ? (
                        <p className="mt-3 text-xs font-semibold text-red-600">
                          {CATALOG_AVAILABILITY_CONFIG.out_of_stock.label}
                        </p>
                      ) : null}

                      <Button
                        className="mt-3 h-11 w-full rounded-lg bg-slate-950 text-sm font-bold text-white shadow-[0_10px_22px_rgba(15,23,42,0.22)] hover:bg-slate-800"
                        disabled={!isProductPurchasable(product) || addingId === addingKey}
                        onClick={() => handleAddToCart(product.id)}
                        aria-label={`Agregar ${product.name} al carrito`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {addingId === addingKey ? "Agregando..." : "Agregar al carrito"}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              asChild
              className="h-12 rounded-md bg-red-600 px-8 text-xs font-black text-white shadow-[0_12px_28px_rgba(220,38,38,0.22)] hover:bg-red-700"
            >
              <Link href="/productos">Ver todos los productos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="servicios" className="relative scroll-mt-28 overflow-hidden bg-[#13154b] py-14 text-white lg:scroll-mt-32 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.18),transparent_34%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300">
              Servicios profesionales
            </p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl lg:text-4xl">Soluciones integrales a medida</h2>
          </div>

          {loadingCatalog ? (
            <p className="relative text-center text-blue-100">Cargando servicios...</p>
          ) : services.length === 0 ? (
            <p className="relative text-center text-blue-100">
              No hay servicios disponibles por el momento.
            </p>
          ) : (
            <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visibleServices.map((service, index) => {
                const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
                const image = getServiceImage(service, index);
                const description =
                  service.description ?? "Servicio profesional certificado para tu empresa.";
                const iconColor = SERVICE_CARD_ICON_COLORS[index % SERVICE_CARD_ICON_COLORS.length];

                return (
                  <article key={service.id} className="group flex min-h-[390px] flex-col overflow-hidden rounded-[1.5rem] bg-white p-3 text-slate-900 shadow-[0_18px_44px_rgba(3,7,18,0.24)] ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(3,7,18,0.3)]">
                    <div className="relative h-48 overflow-hidden rounded-[1.25rem] bg-slate-100">
                      <Image
                        src={image}
                        alt={service.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/35 via-transparent to-transparent" />
                      <span className={`absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_12px_26px_rgba(15,23,42,0.18)] ${iconColor}`}>
                        <Icon className="h-7 w-7 stroke-[1.9]" />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-600">Servicio</p>
                      <h3 className="mt-2 line-clamp-2 min-h-[3.5rem] text-xl font-black leading-7 text-blue-950">{service.name}</h3>
                      <p className="mt-3 line-clamp-4 min-h-[6rem] text-sm font-medium leading-6 text-slate-600">{description}</p>

                      <a href="#contacto" className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-black text-blue-950 transition-colors hover:text-red-600">
                        Más información
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {services.length > 0 && (
            <div className="relative mt-5 text-center">
              {services.length > 4 ? (
                <Button
                  type="button"
                  onClick={() => setShowAllServices((prev) => !prev)}
                  className="h-12 rounded-md bg-amber-300 px-12 text-xs font-black text-blue-950 shadow-[0_12px_28px_rgba(251,191,36,0.25)] hover:bg-amber-400"
                >
                  {showAllServices ? "Ver menos servicios" : "Ver más servicios"}
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-12 rounded-md bg-amber-300 px-12 text-xs font-black text-blue-950 shadow-[0_12px_28px_rgba(251,191,36,0.25)] hover:bg-amber-400"
                >
                  <a href="#contacto">Ver más servicios</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="nosotros" className="scroll-mt-28 bg-white py-16 lg:scroll-mt-32 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {BENEFITS.map((item) => (
            <div key={item.title} className="flex min-h-20 items-center gap-4 rounded-lg border border-slate-100 bg-white px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.07)]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white text-blue-950 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                <item.icon className="h-7 w-7 stroke-[1.8]" />
              </span>
              <span>
                <span className="block text-sm font-black leading-5 text-blue-950">{item.title}</span>
                <span className="mt-1 block text-xs text-slate-500">{item.description}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="certificaciones" className="scroll-mt-28 bg-slate-50 py-20 lg:scroll-mt-32 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-600">
              Certificaciones
            </p>
            <h2 className="mt-3 text-2xl font-black text-blue-950 sm:text-3xl lg:text-4xl">
              Respaldo técnico y cumplimiento normativo
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Trabajamos con procesos alineados a estándares de seguridad para productos, mantenimiento y servicios especializados.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Protocolos seguros",
                description: "Atención con procedimientos orientados a proteger personas, activos e instalaciones.",
              },
              {
                icon: BadgeCheck,
                title: "Equipos certificados",
                description: "Productos y soluciones preparados para operaciones comerciales e industriales.",
              },
              {
                icon: Users,
                title: "Personal especializado",
                description: "Equipo con experiencia en prevención, mantenimiento y control sanitario.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-950">
                  <item.icon className="h-7 w-7 stroke-[1.8]" />
                </span>
                <h3 className="mt-5 text-lg font-black text-blue-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="scroll-mt-28 bg-white py-16 lg:scroll-mt-32 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-32 overflow-hidden rounded-xl bg-[#c91820] px-6 py-7 text-white shadow-[0_18px_42px_rgba(127,29,29,0.18)] sm:px-10 lg:px-16">
            <div className="absolute bottom-0 left-0 hidden h-full w-72 sm:block">
              <Image
                src="/images/carrusel-2.webp"
                alt="Extintor Grupo Tabacchi"
                fill
                sizes="288px"
                className="object-cover object-[22%_66%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c91820]/15 to-[#c91820]" />
            </div>
            <div className="relative flex flex-col gap-5 sm:pl-52 md:flex-row md:items-center md:justify-between lg:pl-64">
              <div>
                <h2 className="text-2xl font-black leading-tight sm:text-3xl">¿Necesitas asesoría o cotización?</h2>
                <p className="mt-2 text-sm font-medium text-red-50">Nuestro equipo está listo para ayudarte.</p>
              </div>
              <Button asChild className="h-14 rounded-md bg-white px-9 text-sm font-black text-blue-950 shadow-[0_10px_24px_rgba(127,29,29,0.18)] hover:bg-slate-100">
                <a href="mailto:ventas@grupotabacchi.com">
                  Cotizar ahora
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#13154b] text-blue-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 border-b border-white/10 pb-7 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.9fr_1.25fr] lg:divide-x lg:divide-white/10">
            <div className="lg:pr-8">
              <LogoMark className="h-20 w-72" />
              <div className="mt-5 flex gap-4">
                {[
                  { label: "Facebook", icon: FaFacebookF },
                  { label: "Instagram", icon: FaInstagram },
                  { label: "WhatsApp", icon: FaWhatsapp },
                  { label: "LinkedIn", icon: FaLinkedinIn },
                ].map((item) => (
                  <a
                    key={item.label}
                    href="#contacto"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white hover:text-blue-950"
                  >
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:px-8">
              <h3 className="text-sm font-black text-white">Enlaces</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-medium text-blue-100/80">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition hover:text-white">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:px-8">
              <h3 className="text-sm font-black text-white">Categorías</h3>
              <ul className="mt-4 space-y-3 text-sm font-medium text-blue-100/80">
                <li>Extintores</li>
                <li>Fumigación</li>
                <li>Limpieza de Tanques</li>
                <li>Accesorios y Repuestos</li>
              </ul>
            </div>

            <div className="lg:pl-8">
              <h3 className="text-sm font-black text-white">Contáctanos</h3>
              <ul className="mt-4 space-y-4 text-sm font-medium text-blue-100/80">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-white" />
                  +51 938 422 157
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white" />
                  ventas@grupotabacchi.com
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-white" />
                  Lima, Perú
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-5 text-center text-sm text-blue-100/70">
            © 2024 Grupo Tabacchi. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      <a
        href="#contacto"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-blue-950 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-950/30 transition hover:scale-105 hover:bg-blue-900"
        aria-label="Solicitar cotización"
      >
        <Phone className="h-4 w-4" />
        <span className="hidden sm:inline">Cotizar</span>
      </a>
    </div>
  );
}
