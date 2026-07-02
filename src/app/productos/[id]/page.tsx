import ProductDetailPage from "@/features/products/components/ProductDetailPage";
import { getProductByIdServer } from "@/lib/serverApi";

interface ProductDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { id } = await params;
  const initialProduct = await getProductByIdServer(id).catch(() => null);

  return <ProductDetailPage productId={id} initialProduct={initialProduct} />;
}
