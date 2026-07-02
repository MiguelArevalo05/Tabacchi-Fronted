"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { CartBreakdown } from "@/features/products/types/ecommerce";
import { formatPrice } from "@/features/products/types/ecommerce";

interface CartOrderSummaryProps {
  breakdown: CartBreakdown;
  disabled?: boolean;
}

export default function CartOrderSummary({ breakdown, disabled = false }: CartOrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

  const handleApplyDiscount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!discountCode.trim()) return;
    setDiscountMessage("Este código no es válido o ha expirado.");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#e3e7ee] bg-white p-6">
        <h2 className="text-[17px] font-bold text-[#17245c]">Resumen del pedido</h2>

        <dl className="mt-5 space-y-3 text-[14px]">
          <div className="flex items-center justify-between gap-4 text-[#5b6472]">
            <dt>Productos ({breakdown.productLineCount})</dt>
            <dd className="font-medium text-[#17245c]">
              {formatPrice(breakdown.productsSubtotal)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 text-[#5b6472]">
            <dt>Servicios ({breakdown.serviceLineCount})</dt>
            <dd className="font-medium text-[#17245c]">
              {formatPrice(breakdown.servicesSubtotal)}
            </dd>
          </div>

          <div className="space-y-3 border-t border-[#e8ebf0] pt-4">
            <div className="flex items-center justify-between gap-4 text-[#5b6472]">
              <dt>Subtotal</dt>
              <dd className="font-medium text-[#17245c]">{formatPrice(breakdown.subtotal)}</dd>
            </div>
            {breakdown.hasIgv ? (
              <div className="flex items-center justify-between gap-4 text-[#5b6472]">
                <dt>IGV (18%)</dt>
                <dd className="font-medium text-[#17245c]">{formatPrice(breakdown.igv)}</dd>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#e8ebf0] pt-4">
            <dt className="text-[15px] font-bold text-[#17245c]">Total a pagar</dt>
            <dd className="text-[26px] font-black leading-none text-[#d71920]">
              {formatPrice(breakdown.total)}
            </dd>
          </div>
        </dl>

        {breakdown.hasExcludedIgvProducts ? (
          <p className="mt-3 text-xs text-[#8b93a1]">
            Algunos productos no incluyen IGV; el impuesto se suma al subtotal.
          </p>
        ) : null}

        <Button
          asChild
          disabled={disabled}
          className="mt-6 h-12 w-full rounded-lg bg-[#17245c] text-[15px] font-bold hover:bg-[#111a45]"
        >
          <Link href="/checkout">
            Generar pedido
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <p className="mt-4 flex items-center justify-center gap-2 text-[12px] text-[#8b93a1]">
          <Lock className="h-3.5 w-3.5" />
          Pago 100% seguro
        </p>
      </section>

      <section className="rounded-xl border border-[#dbeafe] bg-[#f3f8ff] p-5">
        <h3 className="text-[14px] font-bold text-[#17245c]">¿Tienes un código de descuento?</h3>
        <form onSubmit={handleApplyDiscount} className="mt-3 flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(event) => {
              setDiscountCode(event.target.value);
              setDiscountMessage(null);
            }}
            placeholder="Ingresa tu código"
            className="h-11 min-w-0 flex-1 rounded-lg border border-[#d7dce5] bg-white px-4 text-sm outline-none ring-[#17245c] focus:ring-2"
          />
          <Button
            type="submit"
            variant="outline"
            className="h-11 shrink-0 rounded-lg border-[#17245c] bg-white px-5 text-[14px] font-bold text-[#17245c] hover:bg-white"
          >
            Aplicar
          </Button>
        </form>
        {discountMessage ? (
          <p className="mt-2 text-xs font-medium text-[#d71920]">{discountMessage}</p>
        ) : null}
      </section>
    </div>
  );
}
