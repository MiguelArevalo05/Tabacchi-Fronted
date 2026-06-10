"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import StoreHeader from "@/app/landing/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getUploadImageUrl } from "@/lib/utils";
import { formatPrice } from "@/types/ecommerce";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, authLoading, router]);

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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mi carrito</h1>

        {loading ? (
          <p className="text-slate-500">Cargando carrito...</p>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-600 mb-6">Tu carrito está vacío.</p>
            <Button asChild className="bg-blue-700 hover:bg-blue-800">
              <Link href="/landing#productos">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 items-center"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {getUploadImageUrl(item.product.imageUrl) ? (
                      <Image
                        src={getUploadImageUrl(item.product.imageUrl)!}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-blue-700 font-medium">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id || item.quantity >= item.product.stock}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={updating === item.id}
                      className="mt-2 text-red-500 hover:text-red-700 p-1"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 h-fit">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen</h2>
              <div className="flex justify-between text-slate-600 mb-2">
                <span>Productos ({cart?.itemCount})</span>
                <span>{formatPrice(cart?.total ?? 0)}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-700">{formatPrice(cart?.total ?? 0)}</span>
              </div>
              <Button asChild className="w-full mt-6 bg-blue-700 hover:bg-blue-800 h-11">
                <Link href="/checkout">Proceder al checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
