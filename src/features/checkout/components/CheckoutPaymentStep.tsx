"use client";

import { ArrowLeft, ArrowRight, Banknote, ChevronDown, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { PaymentBrandImage } from "@/features/checkout/components/CheckoutPaymentLogos";
import PaymentAccountDetails from "@/features/checkout/components/PaymentAccountDetails";
import PaymentProofUpload from "@/features/checkout/components/PaymentProofUpload";
import { PAYMENT_BRAND_THEMES } from "@/features/checkout/constants/payment-brands";
import {
  CheckoutFormSection,
  checkoutActionsClassName,
  checkoutNoticeClassName,
  CheckoutStepHeader,
  CheckoutStepShell,
} from "@/features/checkout/components/checkoutUi";
import {
  getPaymentConfig,
  type PaymentConfigResponse,
} from "@/features/checkout/services/paymentConfigService";
import type { CheckoutPaymentForm, CheckoutPaymentMethod } from "@/features/checkout/types";
import {
  PAYMENT_METHOD_LABELS,
  requiresPaymentProof,
  validatePaymentForm,
} from "@/features/checkout/utils/payment";

interface CheckoutPaymentStepProps {
  form: CheckoutPaymentForm;
  orderTotal: number;
  onChange: (form: CheckoutPaymentForm) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const PAYMENT_OPTIONS: {
  value: CheckoutPaymentMethod;
  description: string;
  brand?: "yape" | "plin";
  icon?: typeof Banknote;
}[] = [
  {
    value: "yape",
    description: "Paga desde la app y adjunta tu comprobante.",
    brand: "yape",
  },
  {
    value: "plin",
    description: "Paga desde la app y adjunta tu comprobante.",
    brand: "plin",
  },
  {
    value: "cash",
    description: "Paga en efectivo al recibir tu pedido o al recogerlo.",
    icon: Banknote,
  },
];

export default function CheckoutPaymentStep({
  form,
  orderTotal,
  onChange,
  onBack,
  onSubmit,
}: CheckoutPaymentStepProps) {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfigResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPaymentConfig()
      .then(setPaymentConfig)
      .catch(() => setPaymentConfig(null));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validatePaymentForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit();
  };

  const handleProofChange = (proofFile: File | null, proofPreview: string | null) => {
    setError(null);
    onChange({ ...form, proofFile, proofPreview });
  };

  const handleOptionClick = (value: CheckoutPaymentMethod) => {
    setError(null);
    if (form.method === value) {
      onChange({
        method: null,
        proofFile: null,
        proofPreview: null,
      });
      return;
    }

    onChange({
      method: value,
      proofFile: null,
      proofPreview: null,
    });
  };

  const footer = (
    <div className={checkoutActionsClassName}>
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="h-12 rounded-xl border-[#d7dce5] px-6 text-[#17245c] hover:bg-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>
      <Button
        type="submit"
        form="checkout-payment-form"
        className="h-12 rounded-xl bg-[#17245c] px-10 text-[15px] font-bold hover:bg-[#111a45]"
      >
        Continuar
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <CheckoutStepShell footer={footer}>
      <form id="checkout-payment-form" onSubmit={handleSubmit} className="space-y-10">
        <CheckoutStepHeader
          icon={Wallet}
          title="Información de pago"
          subtitle="Selecciona cómo deseas pagar y completa el comprobante si corresponde."
        />

        <CheckoutFormSection title="Método de pago">
          <div className="space-y-3">
            {PAYMENT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = form.method === option.value;
              const isWallet = requiresPaymentProof(option.value);
              const isExpanded = isSelected && isWallet;
              const brandTheme = option.brand ? PAYMENT_BRAND_THEMES[option.brand] : null;
              const walletConfig =
                paymentConfig && isWallet
                  ? option.value === "yape"
                    ? paymentConfig.yape
                    : paymentConfig.plin
                  : null;

              return (
                <div
                  key={option.value}
                  className={[
                    "relative overflow-hidden rounded-2xl border transition-all duration-200",
                    isSelected
                      ? "border-[#17245c]/25 bg-white shadow-[0_4px_20px_rgba(23,36,92,0.08)]"
                      : "border-[#e8ebf0] bg-white hover:border-[#cfd6e3] hover:shadow-sm",
                  ].join(" ")}
                  style={
                    isSelected && brandTheme
                      ? {
                          borderColor: `${brandTheme.selectedBorder}55`,
                          boxShadow: `0 4px 20px ${brandTheme.accent}18`,
                        }
                      : undefined
                  }
                >
                  {isSelected && brandTheme ? (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 top-0 w-1"
                      style={{ backgroundColor: brandTheme.accent }}
                    />
                  ) : null}

                  <div
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleOptionClick(option.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOptionClick(option.value);
                      }
                    }}
                    className="flex cursor-pointer items-center gap-3.5 p-4 outline-none focus-visible:ring-2 focus-visible:ring-[#17245c] focus-visible:ring-offset-2 sm:gap-4 sm:p-5 sm:pl-6"
                  >
                    {option.brand ? (
                      <PaymentBrandImage brand={option.brand} size="lg" />
                    ) : Icon ? (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3f5f9] text-[#17245c] ring-1 ring-[#e8ebf0]">
                        <Icon className="h-5 w-5" />
                      </span>
                    ) : null}

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="block text-[15px] font-bold text-[#17245c] sm:text-[16px]">
                          {PAYMENT_METHOD_LABELS[option.value]}
                        </span>
                        {isWallet ? (
                          <span
                            className={[
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                              isExpanded ? "bg-[#f3f5f9]" : "bg-transparent",
                            ].join(" ")}
                          >
                            <ChevronDown
                              className={[
                                "h-4 w-4 text-[#8b93a1] transition-transform duration-300",
                                isExpanded ? "rotate-180 text-[#17245c]" : "",
                              ].join(" ")}
                              aria-hidden
                            />
                          </span>
                        ) : isSelected ? (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#17245c] text-white">
                            <span className="h-2 w-2 rounded-full bg-white" />
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-[#8b93a1]">
                        {option.description}
                      </span>
                    </span>
                  </div>

                  <div
                    className={[
                      "grid transition-[grid-template-rows] duration-300 ease-in-out",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      {isWallet && walletConfig ? (
                        <div className="space-y-5 px-4 pb-5 pt-1 sm:px-5">
                          <div className="rounded-2xl border border-[#e8ebf0] bg-white p-4 shadow-sm sm:p-5">
                            <PaymentAccountDetails
                              method={option.value as "yape" | "plin"}
                              config={walletConfig}
                              total={orderTotal}
                              variant="embedded"
                            />
                          </div>
                          <div className="rounded-2xl border border-[#e8ebf0] bg-white p-4 shadow-sm sm:p-5">
                            <PaymentProofUpload
                              preview={isSelected ? form.proofPreview : null}
                              onChange={handleProofChange}
                              error={isSelected ? error : null}
                              accentColor={brandTheme?.accent}
                            />
                          </div>
                        </div>
                      ) : isExpanded && !paymentConfig ? (
                        <div className="mx-4 mb-5 rounded-2xl border border-[#e8ebf0] bg-white px-5 py-6 text-center text-sm text-[#8b93a1] sm:mx-5">
                          Cargando datos de pago...
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CheckoutFormSection>

        <div className={checkoutNoticeClassName}>
          <span className="font-semibold">Importante:</span>{" "}
          {form.method === "cash"
            ? "Coordinaremos el pago en efectivo al momento de la entrega o recojo."
            : form.method
              ? "Verificaremos tu comprobante antes de confirmar el pedido."
              : "Elige un método de pago para continuar con tu pedido."}
        </div>
      </form>
    </CheckoutStepShell>
  );
}
