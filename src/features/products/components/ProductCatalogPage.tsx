"use client";

import { ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import StorePageShell from "@/components/layout/StorePageShell";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useCategoryBySlug } from "@/features/categories/hooks/useCategories";
import type { Category } from "@/features/categories/types/category";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";
import { useProducts } from "@/features/products/hooks/useCatalogQueries";
import type { PaginatedResponse, Product } from "@/features/products/types/ecommerce";
import {
  CATALOG_AVAILABILITY_CONFIG,
  formatPrice,
  getProductBadgeOption,
  isProductPurchasable,
} from "@/features/products/types/ecommerce";
import { getUploadImageUrl } from "@/lib/utils";

const FALLBACK_IMAGES = [
  "/images/carrusel-1.webp",
  "/images/carrusel-2.webp",
  "/images/carrusel-3.webp",
  "/images/carrusel-4.webp",
];

function getProductImage(product: Product, index: number) {
  return getUploadImageUrl(product.imageUrl) ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

interface ProductCatalogPageProps {
  serverCategorySlug?: string | null;
  initialProducts?: PaginatedResponse<Product>;
  initialCategory?: Category | null;
}

export default function ProductCatalogPage({
  serverCategorySlug = null,
  initialProducts,
  initialCategory = null,
}: ProductCatalogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("categoria");

  const productParams = useMemo(
    () => ({
      limit: 50,
      ...(categorySlug ? { categorySlug } : {}),
    }),
    [categorySlug]
  );

  const useServerProducts =
    categorySlug === serverCategorySlug || (!categorySlug && !serverCategorySlug);

  const { data: productsResponse, isLoading: loadingProducts } = useProducts(
    productParams,
    useServerProducts ? initialProducts : undefined
  );

  const useServerCategory = categorySlug === serverCategorySlug;

  const { data: category = null, isLoading: loadingCategory } = useCategoryBySlug(
    categorySlug,
    useServerCategory ? initialCategory : undefined
  );

  const { user } = useAuth();
  const { addToCart } = useCart();
  const products = productsResponse?.data ?? [];
  const loading = loadingProducts || (Boolean(categorySlug) && loadingCategory);

  const [addingId, setAddingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleAddToCart = async (event: React.MouseEvent, productId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const redirectPath = categorySlug ? `/productos?categoria=${categorySlug}` : "/productos";

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setAddingId(productId);
    const ok = await addToCart(productId, 1);
    setAddingId(null);
    setToast({
      type: ok ? "success" : "error",
      message: ok ? "Producto agregado al carrito." : "No se pudo agregar al carrito.",
    });
  };

  const clearCategoryFilter = () => {
    router.push("/productos");
  };

  const pageTitle = category?.name ?? "Todos los productos";
  const pageDescription = category?.description
    ? category.description
    : "Equipos certificados para la seguridad de tu empresa y hogar.";

  return (
    <StorePageShell>
      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-600">Catálogo</p>
          <h1 className="mt-3 text-3xl font-black text-[#17245c] sm:text-4xl">{pageTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">{pageDescription}</p>

          {categorySlug ? (
            <button
              type="button"
              onClick={clearCategoryFilter}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-[#17245c] transition hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
              Quitar filtro de categoría
            </button>
          ) : null}
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Cargando productos...</p>
        ) : categorySlug && !category ? (
          <div className="text-center">
            <p className="text-slate-500">La categoría seleccionada no existe.</p>
            <Button asChild className="mt-4 bg-[#17245c] hover:bg-[#101a45]">
              <Link href="/productos">Ver todos los productos</Link>
            </Button>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-500">
            {categorySlug
              ? "No hay productos en esta categoría por el momento."
              : "No hay productos disponibles por el momento."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => {
              const image = getProductImage(product, index);
              const badge = getProductBadgeOption(product.badgeLabel, product.badgeColor);
              const purchasable = isProductPurchasable(product);

              return (
                <Link
                  key={product.id}
                  href={`/productos/${product.id}`}
                  className="group flex min-h-[420px] flex-col rounded-[1.45rem] bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/70 transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.2)]"
                >
                  <div className="relative h-56 overflow-hidden rounded-[1.15rem] bg-gradient-to-br from-slate-50 to-slate-100">
                    {badge ? (
                      <span
                        className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    ) : null}
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {product.category ?? category?.name ?? "Producto"}
                    </p>
                    <h2 className="mt-2 text-lg font-black leading-6 text-slate-950">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {product.description ?? "Producto certificado para tu seguridad."}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <span className="text-xl font-black text-slate-950">{formatPrice(product.price)}</span>
                      {!purchasable ? (
                        <span className="text-xs font-semibold text-red-600">
                          {CATALOG_AVAILABILITY_CONFIG.out_of_stock.label}
                        </span>
                      ) : null}
                    </div>

                    <Button
                      className="mt-3 h-11 w-full rounded-lg bg-[#17245c] text-sm font-bold text-white hover:bg-[#101a45]"
                      disabled={!purchasable || addingId === product.id}
                      onClick={(event) => handleAddToCart(event, product.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {addingId === product.id ? "Agregando..." : "Agregar al carrito"}
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </StorePageShell>
  );
}
