import { Suspense } from "react";

import ProductCatalogPage from "@/features/products/components/ProductCatalogPage";
import {
  getCategoryBySlugServer,
  getProductsServer,
} from "@/lib/serverApi";

interface ProductosPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const { categoria } = await searchParams;
  const productParams = {
    limit: 50,
    ...(categoria ? { categorySlug: categoria } : {}),
  };

  const [initialCategory, initialProducts] = await Promise.all([
    categoria ? getCategoryBySlugServer(categoria).catch(() => null) : Promise.resolve(null),
    getProductsServer(productParams).catch(() => undefined),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
          Cargando catálogo...
        </div>
      }
    >
      <ProductCatalogPage
        serverCategorySlug={categoria ?? null}
        initialCategory={initialCategory}
        initialProducts={initialProducts}
      />
    </Suspense>
  );
}
