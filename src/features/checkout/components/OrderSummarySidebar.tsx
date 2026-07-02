"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

import type { OrderSummaryData } from "@/features/checkout/utils/orderSummary";
import { formatPrice } from "@/features/products/types/ecommerce";
import { getUploadImageUrl } from "@/lib/utils";

interface OrderSummarySidebarProps {
  summary: OrderSummaryData;
  detailHref?: string;
  detailLabel?: string;
  editCartHref?: string;
}

export default function OrderSummarySidebar({
  summary,
  detailHref,
  detailLabel = "Ver detalle del pedido",
  editCartHref,
}: OrderSummarySidebarProps) {
  const { productItems, serviceItems, breakdown } = summary;
  const actionHref = detailHref ?? editCartHref;
  const actionLabel = detailHref ? detailLabel : "Editar carrito";

  return (
    <aside className="h-fit w-full rounded-2xl border border-[#e3e7ee] bg-white p-6 shadow-[0_8px_30px_rgba(23,36,92,0.04)] sm:p-7 lg:sticky lg:top-[calc(var(--store-header-height,88px)+24px)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-bold text-[#17245c]">Resumen del pedido</h2>
        {actionHref ? (
          <Link
            href={actionHref}
            className="text-[13px] font-semibold text-[#17245c] underline-offset-2 hover:underline"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>

      {productItems.length > 0 ? (
        <section className="mt-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-[#8b93a1]">
            Productos ({productItems.length})
          </h3>
          <ul className="mt-3 space-y-4">
            {productItems.map((item) => {
              const imageUrl = getUploadImageUrl(item.imageUrl);
              return (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#e8ebf0] bg-[#f8fafc]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-snug text-[#17245c]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#8b93a1]">Cant.: {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-[14px] font-bold text-[#17245c]">
                    {formatPrice(item.subtotal)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {serviceItems.length > 0 ? (
        <section className="mt-5 border-t border-[#e8ebf0] pt-5">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-[#8b93a1]">
            Servicios ({serviceItems.length})
          </h3>
          <ul className="mt-3 space-y-4">
            {serviceItems.map((item) => {
              const imageUrl = getUploadImageUrl(item.imageUrl);
              return (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#e8ebf0] bg-[#f8fafc]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-snug text-[#17245c]">
                      {item.name}
                    </p>
                    {item.description ? (
                      <p className="mt-0.5 line-clamp-2 text-[12px] text-[#8b93a1]">
                        {item.description}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[12px] text-[#8b93a1]">Cant.: {item.quantity}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-[14px] font-bold text-[#17245c]">
                    {formatPrice(item.subtotal)}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <dl className="mt-5 space-y-2 border-t border-[#e8ebf0] pt-4 text-[14px]">
        <div className="flex justify-between text-[#5b6472]">
          <dt>Subtotal</dt>
          <dd className="font-medium text-[#17245c]">{formatPrice(breakdown.subtotal)}</dd>
        </div>
        {breakdown.hasIgv ? (
          <div className="flex justify-between text-[#5b6472]">
            <dt>IGV (18%)</dt>
            <dd className="font-medium text-[#17245c]">{formatPrice(breakdown.igv)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-[#e8ebf0] pt-4">
          <dt className="text-[15px] font-bold text-[#17245c]">Total a pagar</dt>
          <dd className="text-[26px] font-black leading-none text-[#d71920]">
            {formatPrice(breakdown.total)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#e8ebf0] bg-[#f8fafc] px-3 py-2.5 text-center text-[11px] leading-relaxed text-[#8b93a1]">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        Compra 100% segura — Tus datos están protegidos con encriptación SSL.
      </p>
    </aside>
  );
}
