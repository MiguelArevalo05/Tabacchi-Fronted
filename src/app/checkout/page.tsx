"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import StoreHeader from "@/app/landing/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/services/ecommerceOrderService";
import { formatPrice, getCartLineItem } from "@/types/ecommerce";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, refreshCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    shippingAddress: "",
    contactPhone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user && cart && cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart, user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await createOrder(form);
      await refreshCart();
      router.push(`/my-orders?created=${order.id}`);
    } catch {
      setToast({ type: "error", message: "No se pudo crear la orden. Verifica tu carrito." });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !cart) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Datos de entrega</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Dirección de envío
              </label>
              <input
                type="text"
                value={form.shippingAddress}
                onChange={(e) => setForm((p) => ({ ...p, shippingAddress: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Av. Ejemplo 123, Lima"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono de contacto
              </label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+51 999 999 999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Instrucciones especiales..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 h-11"
            >
              {loading ? "Generando orden..." : "Confirmar orden"}
            </Button>
          </form>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 h-fit">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen del pedido</h2>
            <ul className="space-y-3 mb-4">
              {cart.items.map((item) => {
                const line = getCartLineItem(item);
                if (!line) return null;

                return (
                  <li key={item.id} className="flex justify-between text-sm gap-3">
                    <span className="text-slate-600">
                      {line.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(Number(line.price) * item.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-700">{formatPrice(cart.total)}</span>
            </div>
            <Button variant="outline" asChild className="w-full mt-4">
              <Link href="/cart">Volver al carrito</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
