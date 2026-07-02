"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";

import StorePageShell from "@/components/layout/StorePageShell";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import CartItemsTable from "@/features/cart/components/CartItemsTable";
import CartOrderSummary from "@/features/cart/components/CartOrderSummary";
import { useCart } from "@/features/cart/hooks/useCart";
import { getCartBreakdown } from "@/features/cart/utils/cartTotals";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/carrito");
    }
  }, [user, authLoading, router]);

  const items = cart?.items ?? [];
  const breakdown = cart ? getCartBreakdown(cart) : null;

  const handleQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(itemId);
    const ok = await updateQuantity(itemId, quantity);
    setUpdating(null);
    if (!ok) setToast({ type: "error", message: "No se pudo actualizar la cantidad." });
  };

  const handleRemove = async (itemId: string) => {
    setUpdating(itemId);
    const ok = await removeItem(itemId);
    setUpdating(null);
    if (ok) setToast({ type: "success", message: "Producto eliminado del carrito." });
    else setToast({ type: "error", message: "No se pudo eliminar el producto." });
  };

  const handleClearCart = async () => {
    setClearing(true);
    const ok = await clearCart();
    setClearing(false);
    if (ok) setToast({ type: "success", message: "Carrito vaciado correctamente." });
    else setToast({ type: "error", message: "No se pudo vaciar el carrito." });
  };

  if (authLoading || !user) {
    return (
      <StorePageShell>
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-slate-500">Cargando carrito...</p>
        </div>
      </StorePageShell>
    );
  }

  return (
    <StorePageShell>
      {toast ? (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      ) : null}

      <div className="mx-auto max-w-[1180px] px-4 pb-14 pt-3 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-[#8b93a1]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/landing" className="hover:text-[#17245c]">
                Inicio
              </Link>
            </li>
            <li className="text-[#c4c9d1]">›</li>
            <li className="font-medium text-[#5b6472]">Carrito de compras</li>
          </ol>
        </nav>

        <header className="mt-3 mb-7">
          <h1 className="text-[32px] font-bold leading-tight text-[#17245c]">Carrito de compras</h1>
          <p className="mt-1.5 text-[15px] text-[#6b7280]">
            Revisa los productos y servicios que has seleccionado.
          </p>
        </header>

        {loading ? (
          <p className="text-slate-500">Cargando carrito...</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-[#e3e7ee] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f4f6] text-slate-400">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-[#17245c]">Tu carrito está vacío</h2>
            <p className="mt-2 text-[#6b7280]">
              Agrega productos o servicios desde el catálogo para continuar con tu pedido.
            </p>
            <Button asChild className="mt-6 bg-[#17245c] font-bold hover:bg-[#111a45]">
              <Link href="/productos">Ir al catálogo</Link>
            </Button>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
            <section>
              <CartItemsTable
                items={items}
                updatingId={updating}
                onQuantityChange={handleQuantity}
                onRemove={handleRemove}
              />

              <div className="mt-6 flex flex-col gap-3 border-t border-[#e8ebf0] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={clearing}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#cfd6e3] bg-white px-5 text-[14px] font-semibold text-[#17245c] transition hover:bg-[#f8fafc] disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Vaciar carrito
                </button>
                <Link
                  href="/productos"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#cfd6e3] bg-white px-5 text-[14px] font-semibold text-[#17245c] transition hover:bg-[#f8fafc]"
                >
                  Seguir comprando
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {breakdown ? (
              <div className="lg:sticky lg:top-[calc(var(--store-header-height,120px)+1.25rem)]">
                <CartOrderSummary breakdown={breakdown} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </StorePageShell>
  );
}
