"use client";

import { Check, Copy, Smartphone, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PaymentBrandImage } from "@/features/checkout/components/CheckoutPaymentLogos";
import type { PaymentBrand } from "@/features/checkout/constants/payment-brands";
import { PAYMENT_BRAND_THEMES } from "@/features/checkout/constants/payment-brands";
import type { WalletPaymentConfig } from "@/features/checkout/services/paymentConfigService";
import { formatPrice } from "@/features/products/types/ecommerce";

interface PaymentAccountDetailsProps {
  method: PaymentBrand;
  config: WalletPaymentConfig;
  total: number;
  variant?: "default" | "embedded";
}

export default function PaymentAccountDetails({
  method,
  config,
  total,
  variant = "default",
}: PaymentAccountDetailsProps) {
  const methodLabel = method === "yape" ? "Yape" : "Plin";
  const theme = PAYMENT_BRAND_THEMES[method];
  const isEmbedded = variant === "embedded";
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(config.phone.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const stepBadgeClassName =
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white";

  return (
    <div className={isEmbedded ? "space-y-4" : "rounded-2xl border border-[#e3e7ee] bg-white p-5 sm:p-6"}>
      <div className="flex items-start gap-3">
        <span
          className={stepBadgeClassName}
          style={{ backgroundColor: theme.accent }}
        >
          1
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] font-bold text-[#17245c]">
            Realiza el pago desde {methodLabel}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#8b93a1]">
            Abre la app, envía el monto exacto al número indicado y conserva la captura.
          </p>
        </div>
        {!isEmbedded ? (
          <PaymentBrandImage brand={method} size="md" />
        ) : null}
      </div>

      <div
        className={[
          "overflow-hidden rounded-2xl border",
          isEmbedded ? "mt-1" : "mt-5",
        ].join(" ")}
        style={{
          borderColor: theme.surfaceBorder,
          backgroundColor: theme.surface,
        }}
      >
        <div
          className="flex items-center gap-3 border-b px-4 py-3.5 sm:px-5"
          style={{ borderColor: theme.surfaceBorder }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: theme.accent }}
          >
            <Smartphone className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b93a1]">
              Número de celular
            </p>
            <p className="mt-0.5 truncate text-[20px] font-bold tracking-wide text-[#17245c] sm:text-[22px]">
              {config.phone}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyPhone}
            className={[
              "h-10 shrink-0 rounded-xl border bg-white px-3.5 text-[13px] font-semibold shadow-sm transition",
              copied ? "border-emerald-200 text-emerald-700" : "border-[#d7dce5] text-[#17245c]",
            ].join(" ")}
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" />
                Copiar
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-px bg-white/60 sm:grid-cols-2">
          <div className="bg-white/80 px-4 py-4 sm:px-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b93a1]">
              Titular de la cuenta
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-[15px] font-semibold text-[#17245c]">
              <UserRound className="h-4 w-4 shrink-0 text-[#8b93a1]" />
              <span className="truncate">{config.holderName}</span>
            </p>
          </div>

          <div
            className="px-4 py-4 sm:px-5"
            style={{ backgroundColor: `${theme.accent}08` }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: theme.accentDark }}
            >
              Monto exacto
            </p>
            <p
              className="mt-1.5 text-[22px] font-black tracking-tight sm:text-[24px]"
              style={{ color: theme.accentDark }}
            >
              {formatPrice(total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
