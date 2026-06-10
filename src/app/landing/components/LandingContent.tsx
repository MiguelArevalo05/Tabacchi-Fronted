"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bug,
  Droplets,
  ShieldCheck,
  Sparkles,
  Clock,
  Award,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Truck,
  BadgeCheck,
  Star,
  Headphones,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import StoreHeader from "@/app/landing/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getProducts } from "@/services/productService";
import { getServices } from "@/services/serviceOfferingService";
import type { Product, ServiceOffering } from "@/types/ecommerce";
import { getUploadImageUrl } from "@/lib/utils";
import { formatPrice } from "@/types/ecommerce";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const SERVICE_ICONS: LucideIcon[] = [Bug, Droplets, Sparkles, ShieldCheck];
const FALLBACK_IMAGES = [
  "/images/carrusel-1.webp",
  "/images/carrusel-2.webp",
  "/images/carrusel-3.webp",
  "/images/carrusel-4.webp",
];

const FOOTER_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#productos", label: "Productos" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Seguridad total",
    description: "Protocolos certificados para personas y mascotas",
  },
  {
    icon: BadgeCheck,
    title: "Certificación PE",
    description: "Cumplimiento de normas técnicas peruanas",
  },
  {
    icon: Star,
    title: "Calidad premium",
    description: "Productos autorizados y equipos capacitados",
  },
  {
    icon: Truck,
    title: "Respuesta rápida",
    description: "Atención y programación en 24-48 horas",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Evaluación",
    description: "Inspeccionamos tu espacio y definimos el tratamiento adecuado.",
  },
  {
    step: "02",
    title: "Tratamiento",
    description: "Aplicamos protocolos seguros con productos autorizados.",
  },
  {
    step: "03",
    title: "Seguimiento",
    description: "Garantizamos resultados duraderos con control post-servicio.",
  },
];

const CAROUSEL_IMAGES = [
  {
    src: "/images/carrusel-1.webp",
    alt: "Comprometidos con el trabajo en equipo",
  },
  {
    src: "/images/carrusel-2.webp",
    alt: "Construyendo el futuro con excelencia",
  },
  {
    src: "/images/carrusel-3.webp",
    alt: "Excelencia en cada servicio",
  },
  {
    src: "/images/carrusel-4.webp",
    alt: "Comprometidos con el medio ambiente",
  },
];

const HERO_SLIDES = CAROUSEL_IMAGES;

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

function FooterBrand() {
  return (
    <div className="flex items-center gap-4">
      <BrandLogo className="h-16 w-16" />
      <div>
        <h3 className="text-xl font-bold text-white">Grupo Tabacchi</h3>
        <p className="text-sm text-slate-400">Seguridad y control profesional</p>
      </div>
    </div>
  );
}

function SectionHeading({
  badge,
  title,
  subtitle,
  light = false,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  light?: boolean;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {badge && (
        <span
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            light
              ? "bg-white/10 text-blue-100 border border-white/20"
              : "bg-blue-50 text-blue-700 border border-blue-100"
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl font-bold tracking-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-lg leading-relaxed ${
          light ? "text-blue-100" : "text-slate-600"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default function LandingContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    Promise.all([
      getServices({ limit: 20 }),
      getProducts({ limit: 20 }),
    ])
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
    setAddingId(productId);
    const ok = await addToCart(productId, 1);
    setAddingId(null);
    if (ok) {
      setToast({ type: "success", message: "Producto agregado al carrito." });
    } else {
      setToast({ type: "error", message: "No se pudo agregar al carrito." });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 scroll-smooth">
      <StoreHeader />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Hero */}
      <section
        id="inicio"
        className="relative min-h-[calc(100vh-5rem)] flex items-center pt-20"
      >
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
          className="absolute inset-0 w-full h-full"
        >
          <CarouselContent className="h-full ml-0">
            {HERO_SLIDES.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 h-full">
                <div className="relative w-full h-[calc(100vh-5rem)] min-h-[520px]">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/30" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <Award className="w-4 h-4 text-yellow-400" />
              Grupo Tabacchi S.A.C. — Especialistas en control y seguridad
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Protege tu hogar y empresa{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-yellow-300">
                con confianza
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl">
              Fumigación, control de plagas, desinfección y limpieza de tanques.
              Soluciones seguras cumpliendo los estándares y normas técnicas
              peruanas.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-semibold h-13 px-8 text-base shadow-xl shadow-yellow-400/20"
              >
                <a href="#contacto">
                  Cotizar ahora
                  <ChevronRight className="w-5 h-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-13 px-8 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <a href="#servicios">Explorar servicios</a>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-white/90">
              {[
                { value: "100+", label: "Servicios realizados" },
                { value: "100%", label: "Seguridad garantizada" },
                { value: "24/7", label: "Atención rápida" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-400">
                    {stat.value}
                  </span>
                  <span className="text-sm text-slate-300 max-w-[100px] leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 lg:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.title}
                className="group bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors">
                  <benefit.icon className="w-6 h-6 text-blue-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services — category cards with images */}
      <section id="servicios" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Nuestros servicios"
            title="Encuentra lo que necesitas"
            subtitle="Explora nuestras soluciones y elige el tratamiento exacto que tu espacio requiere."
          />

          {loadingCatalog ? (
            <p className="text-center text-slate-500">Cargando servicios...</p>
          ) : services.length === 0 ? (
            <p className="text-center text-slate-500">No hay servicios disponibles por el momento.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {services.map((service, index) => {
                const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
                const image = getUploadImageUrl(service.imageUrl) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                return (
                  <article
                    key={service.id}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={image}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                      {index === 0 && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-yellow-400 text-slate-900 text-xs font-bold uppercase tracking-wide">
                          Más solicitado
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <a
                        href="#contacto"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:gap-2 transition-all"
                      >
                        Solicitar cotización
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section id="productos" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Tienda"
            title="Productos destacados"
            subtitle="Agrega productos al carrito y genera tu orden. Debes iniciar sesión para comprar."
          />

          {loadingCatalog ? (
            <p className="text-center text-slate-500">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-slate-500">No hay productos disponibles por el momento.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-100">
                    {getUploadImageUrl(product.imageUrl) ? (
                      <Image
                        src={getUploadImageUrl(product.imageUrl)!}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-blue-700">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-slate-400">Stock: {product.stock}</span>
                    </div>
                    <Button
                      className="w-full mt-4 bg-blue-700 hover:bg-blue-800"
                      disabled={product.stock < 1 || addingId === product.id}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {addingId === product.id ? "Agregando..." : "Agregar al carrito"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Cómo trabajamos"
            title="Un proceso simple y transparente"
            subtitle="Desde la primera visita hasta el seguimiento, cuidamos cada detalle de tu servicio."
          />
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {PROCESS_STEPS.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-200 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-700 text-white text-xl font-bold mb-5 shadow-lg shadow-blue-700/30">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Carousel */}
      <section id="nosotros" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4 border border-blue-100">
                Sobre nosotros
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Experiencia que genera confianza
              </h2>
              <p className="mt-6 text-slate-600 text-lg leading-relaxed">
                En Grupo Tabacchi trabajamos con equipos capacitados, productos
                autorizados y protocolos alineados a la normativa peruana. Nos
                enfocamos en resultados duraderos y en la tranquilidad de
                nuestros clientes.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  {
                    icon: Clock,
                    text: "Respuesta rápida y programación flexible",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Procedimientos seguros para personas y mascotas",
                  },
                  {
                    icon: Award,
                    text: "Cumplimiento de estándares técnicos nacionales",
                  },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-blue-700" />
                    </span>
                    <span className="text-slate-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 4500 })]}
              className="w-full"
            >
              <CarouselContent>
                {CAROUSEL_IMAGES.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                      <p className="absolute bottom-4 left-4 right-4 text-white font-medium text-lg">
                        {image.alt}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 bg-white/90 hover:bg-white" />
              <CarouselNext className="right-3 bg-white/90 hover:bg-white" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Expert help CTA — Gobox "¿Necesitas ayuda?" style */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 shadow-2xl shadow-blue-900/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center p-8 sm:p-12 lg:p-16">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-sm font-medium mb-6 border border-white/20">
                  <Headphones className="w-4 h-4" />
                  Asesoría gratuita
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  ¿Necesitas ayuda con tu espacio?
                </h2>
                <p className="mt-4 text-blue-100 text-lg leading-relaxed">
                  Nuestros especialistas te ayudan a elegir el tratamiento
                  correcto y planificar el servicio ideal para hogares, comercios
                  e industria en todo el Perú.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Evaluación sin compromiso",
                    "Cotización personalizada",
                    "Programación flexible",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-white/90 text-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  asChild
                  className="mt-8 bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-semibold h-12 px-8 shadow-lg"
                >
                  <a href="#contacto">
                    Contactar asesor
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </Button>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl hidden sm:block">
                <Image
                  src="/images/carrusel-3.webp"
                  alt="Equipo Grupo Tabacchi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Contacto"
            title="Hablemos de tu proyecto"
            subtitle="Cuéntanos qué necesitas y te responderemos a la brevedad con una propuesta adaptada."
          />

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-5">
              {[
                {
                  icon: Phone,
                  label: "Teléfono",
                  value: "+51 999 999 999",
                  href: "tel:+51999999999",
                },
                {
                  icon: Mail,
                  label: "Correo",
                  value: "contacto@grupotabacchi.com",
                  href: "mailto:contacto@grupotabacchi.com",
                },
                {
                  icon: MapPin,
                  label: "Ubicación",
                  value: "Lima, Perú",
                  href: null,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href ?? undefined}
                  className={`flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm ${
                    item.href
                      ? "hover:shadow-md hover:border-blue-100 transition-all"
                      : ""
                  }`}
                >
                  <span className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-blue-700" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                      {item.label}
                    </p>
                    <p className="text-slate-800 font-medium">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="lg:col-span-3 bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Acceso al sistema
                  </h3>
                  <p className="text-sm text-slate-500">
                    Plataforma de gestión para clientes y colaboradores
                  </p>
                </div>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Si ya eres cliente o colaborador de Grupo Tabacchi, ingresa a la
                plataforma para gestionar tus servicios, pedidos y reportes.
              </p>
              <Button
                asChild
                className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 h-12 px-8 text-base"
              >
                <Link href="/login">
                  Ir al login
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
              <p className="mt-6 text-sm text-slate-500">
                Para cotizaciones comerciales, escríbenos por correo o teléfono.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <FooterBrand />
              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
                Especialistas en extintores, fumigación, control de plagas y
                limpieza de tanques. Calidad y normas técnicas peruanas.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Navegación
              </h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/login"
                    className="text-sm text-slate-400 hover:text-yellow-400 transition-colors"
                  >
                    Acceso clientes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Servicios
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                {services.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Contacto
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                  +51 999 999 999
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                  contacto@grupotabacchi.com
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                  Lima, Perú
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} Grupo Tabacchi S.A.C. Todos los
              derechos reservados.
            </p>
            <p className="text-xs text-slate-600 text-center sm:text-right">
              Extintores · Fumigación · Limpieza de tanques
            </p>
          </div>
        </div>
      </footer>

      {/* Floating contact button */}
      <a
        href="#contacto"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-full shadow-xl shadow-blue-700/40 font-medium text-sm transition-all hover:scale-105"
        aria-label="Solicitar cotización"
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Cotizar</span>
      </a>
    </div>
  );
}
