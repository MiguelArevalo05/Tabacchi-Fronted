"use client";

import {
  ArrowLeft,
  Award,
  ChevronDown,
  ClipboardList,
  FileText,
  Headphones,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import StorePageShell from "@/components/layout/StorePageShell";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";
import { useProduct } from "@/features/products/hooks/useCatalogQueries";
import PaymentMethodLogos from "@/features/products/components/PaymentMethodLogos";
import ProductImageGallery from "@/features/products/components/ProductImageGallery";
import type { Product } from "@/features/products/types/ecommerce";
import {
  formatPrice,
  getProductBadgeOption,
  getProductImages,
  getStockLabel,
  isProductPurchasable,
  parseProductTextSections,
} from "@/features/products/types/ecommerce";
import { getUploadImageUrl } from "@/lib/utils";

function getResolvedImages(product: Product): string[] {
  return getProductImages(product)
    .map((url) => getUploadImageUrl(url))
    .filter((url): url is string => Boolean(url));
}

const DEFAULT_SPECS = [
  "Tipo: Polvo químico seco ABC",
  "Capacidad: 6 Kg",
  "Presión: Manómetro de control incluido",
  "Material: Cilindro de acero resistente",
  "Normativa: Cumple estándares técnicos peruanos",
];

const DEFAULT_DOCUMENTATION = [
  "Certificado de conformidad técnica",
  "Ficha técnica del fabricante",
  "Manual de uso y mantenimiento",
];

const DEFAULT_RECOMMENDATIONS = [
  "Instalar en lugares visibles y de fácil acceso.",
  "Revisar el manómetro mensualmente.",
  "Realizar mantenimiento preventivo cada 12 meses.",
  "Capacitar al personal en su uso correcto.",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < Math.round(rating)
              ? "fill-[#fbbf24] text-[#fbbf24]"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: typeof ShieldCheck;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#17245c]">
          <Icon className="h-[18px] w-[18px] stroke-[1.8] text-slate-500" />
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? <div className="pb-4 pl-8 text-sm leading-7 text-slate-600">{children}</div> : null}
    </div>
  );
}

interface ProductDetailPageProps {
  productId: string;
  initialProduct?: Product | null;
}

export default function ProductDetailPage({
  productId,
  initialProduct = null,
}: ProductDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { data: product = initialProduct, isLoading: loading } = useProduct(
    productId,
    initialProduct
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const images = useMemo(() => (product ? getResolvedImages(product) : []), [product]);
  const badge = product ? getProductBadgeOption(product.badgeLabel, product.badgeColor) : null;
  const rating = product ? Number(product.rating ?? 5) : 5;
  const reviewCount = product?.reviewCount ?? 48;
  const category = product?.category ?? "Extintores";
  const warrantyMonths = product?.warrantyMonths ?? 12;
  const purchasable = product ? isProductPurchasable(product) : false;

  const technicalSpecs =
    parseProductTextSections(product?.technicalSpecs).length > 0
      ? parseProductTextSections(product?.technicalSpecs)
      : DEFAULT_SPECS;

  const documentation =
    parseProductTextSections(product?.documentation).length > 0
      ? parseProductTextSections(product?.documentation)
      : DEFAULT_DOCUMENTATION;

  const recommendations =
    parseProductTextSections(product?.usageRecommendations).length > 0
      ? parseProductTextSections(product?.usageRecommendations)
      : DEFAULT_RECOMMENDATIONS;

  const handleAddToCart = async () => {
    if (!product) return;

    if (!user) {
      router.push(`/login?redirect=/productos/${product.id}`);
      return;
    }

    setAdding(true);
    const ok = await addToCart(product.id, quantity);
    setAdding(false);
    setToast({
      type: ok ? "success" : "error",
      message: ok ? "Producto agregado al carrito." : "No se pudo agregar al carrito.",
    });
  };

  if (loading) {
    return (
      <StorePageShell>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-500 sm:px-6 lg:px-8">
          Cargando producto...
        </div>
      </StorePageShell>
    );
  }

  if (!product) {
    return (
      <StorePageShell>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black text-[#17245c]">Producto no encontrado</h1>
          <Button asChild className="mt-6 bg-[#17245c] hover:bg-[#101a45]">
            <Link href="/productos">Volver al catálogo</Link>
          </Button>
        </div>
      </StorePageShell>
    );
  }

  return (
    <StorePageShell>
      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/landing" className="hover:text-[#17245c]">
                Inicio
              </Link>
            </li>
            <li className="text-slate-300">›</li>
            <li>
              <Link href="/productos" className="hover:text-[#17245c]">
                Productos
              </Link>
            </li>
            <li className="text-slate-300">›</li>
            <li>
              <Link href="/productos" className="hover:text-[#17245c]">
                {category}
              </Link>
            </li>
            <li className="text-slate-300">›</li>
            <li className="font-medium text-slate-700">{product.name}</li>
          </ol>
        </nav>

        <Link
          href="/productos"
          className="mt-4 mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#17245c] transition hover:text-[#d71920]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a {category.toLowerCase()}
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_300px] lg:gap-10">
          {images.length > 0 ? (
            <ProductImageGallery images={images} productName={product.name} />
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#f3f4f6] text-sm text-slate-500">
              Sin imágenes del producto
            </div>
          )}

          <div className="min-w-0">
            {badge ? (
              <span className="inline-flex rounded-md bg-[#fff1f2] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#e11d48]">
                {badge.label}
              </span>
            ) : null}

            <h1 className="mt-3 text-[1.75rem] font-bold leading-tight text-[#17245c] sm:text-[2rem]">
              {product.name}
            </h1>

            <div className="mt-2.5 flex items-center gap-2">
              <StarRating rating={rating} />
              <span className="text-sm text-slate-500">({reviewCount} reseñas)</span>
            </div>

            <p className="mt-4 text-[15px] leading-7 text-slate-600">
              {product.description ??
                "Extintor portátil de polvo químico seco, eficiente para distintos tipos de incendio."}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 border-y border-slate-100 py-5 sm:grid-cols-3 sm:gap-3">
              {[
                { icon: ShieldCheck, title: "Certificado", subtitle: "Norma Técnica Peruana" },
                { icon: Award, title: "Garantía", subtitle: `${warrantyMonths} meses` },
                { icon: Truck, title: "Envíos", subtitle: "A todo el Perú" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-2.5">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#17245c]" />
                  <div>
                    <p className="text-xs font-bold text-[#17245c]">{item.title}</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200">
              <AccordionItem title="Especificaciones técnicas" icon={ClipboardList}>
                <ul className="space-y-1.5">
                  {technicalSpecs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title="Documentación y certificados" icon={FileText}>
                <ul className="space-y-1.5">
                  {documentation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title="Recomendaciones de uso" icon={ShieldCheck}>
                <ul className="space-y-1.5">
                  {recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionItem>
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-[calc(var(--store-header-height,0px)+1rem)] lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-medium text-slate-500">Precio</p>
              <p className="mt-1 text-[2rem] font-bold leading-none text-[#d71920]">
                {formatPrice(product.price)}
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                {product.priceIncludesIgv === false
                  ? "Precio no incluye IGV"
                  : "Precio incluye IGV"}
              </p>

              <div className="my-5 border-t border-slate-100" />

              <p className="text-sm font-medium text-slate-600">Stock disponible</p>
              <div className="mt-2">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                    purchasable
                      ? "bg-[#ecfdf5] text-[#059669]"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {purchasable ? "En stock" : "Agotado"}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{getStockLabel(product.stock)}</p>

              <div className="my-5 border-t border-slate-100" />

              <div className="flex overflow-hidden rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:bg-slate-50"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex flex-1 items-center justify-center border-x border-slate-200 text-sm font-semibold text-[#17245c]">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stock || prev + 1, prev + 1))
                  }
                  className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:bg-slate-50"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!purchasable || adding}
                onClick={handleAddToCart}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#17245c] text-sm font-semibold text-white transition hover:bg-[#101a45] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                {adding ? "Agregando..." : "Agregar al carrito"}
              </button>

              <Link
                href="/carrito"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-400 text-sm font-semibold text-[#17245c] transition hover:bg-amber-500"
              >
                <ShoppingCart className="h-4 w-4" />
                Ver mi carrito
              </Link>

              <div className="my-5 border-t border-slate-100" />

              <p className="text-xs font-medium text-slate-500">Métodos de pago</p>
              <PaymentMethodLogos />

              <div className="mt-5 rounded-xl bg-[#eff6ff] p-4">
                <div className="flex items-start gap-3">
                  <Headphones className="mt-0.5 h-5 w-5 shrink-0 text-[#17245c]" />
                  <div>
                    <p className="text-sm font-semibold text-[#17245c]">
                      ¿Necesitas ayuda para elegir?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Nuestros especialistas te asesoran sin costo.
                    </p>
                    <a
                      href="tel:+51936422757"
                      className="mt-2 inline-block text-sm font-bold text-[#17245c]"
                    >
                      +51 936 422 757
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </StorePageShell>
  );
}
