import LandingContent from "@/features/landing/components/LandingContent";
import {
  getCategoriesServer,
  getProductsServer,
  getServicesServer,
} from "@/lib/serverApi";

export default async function LandingPage() {
  const [services, products, categories] = await Promise.all([
    getServicesServer({ limit: 20 }).catch(() => ({ data: [] })),
    getProductsServer({ limit: 20 }).catch(() => ({ data: [] })),
    getCategoriesServer({ limit: 20 }).catch(() => ({ data: [] })),
  ]);

  return (
    <LandingContent
      initialServices={services.data}
      initialProducts={products.data}
      initialCategories={categories.data}
    />
  );
}
