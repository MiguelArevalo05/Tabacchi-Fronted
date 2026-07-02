"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CheckoutField,
  CheckoutFormSection,
  checkoutActionsClassName,
  checkoutFieldGridClassName,
  checkoutInputClassName,
  checkoutNoticeClassName,
  CheckoutSelect,
  CheckoutStepHeader,
  CheckoutStepShell,
  RequiredMark,
} from "@/features/checkout/components/checkoutUi";
import {
  DOCUMENT_TYPE_OPTIONS,
  type CheckoutCustomerForm,
} from "@/features/checkout/types";

interface CheckoutCustomerStepProps {
  form: CheckoutCustomerForm;
  loading: boolean;
  onChange: (form: CheckoutCustomerForm) => void;
  onSubmit: () => void;
}

export default function CheckoutCustomerStep({
  form,
  loading,
  onChange,
  onSubmit,
}: CheckoutCustomerStepProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const updateField = <K extends keyof CheckoutCustomerForm>(
    key: K,
    value: CheckoutCustomerForm[K]
  ) => {
    onChange({ ...form, [key]: value });
  };

  const footer = (
    <div className={checkoutActionsClassName}>
      <Button
        type="button"
        variant="outline"
        asChild
        className="h-12 rounded-xl border-[#d7dce5] px-6 text-[#17245c] hover:bg-white"
      >
        <Link href="/carrito">Volver al carrito</Link>
      </Button>
      <Button
        type="submit"
        form="checkout-customer-form"
        disabled={loading}
        className="h-12 rounded-xl bg-[#17245c] px-10 text-[15px] font-bold hover:bg-[#111a45]"
      >
        {loading ? "Guardando..." : "Continuar"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <CheckoutStepShell footer={footer}>
      <form id="checkout-customer-form" onSubmit={handleSubmit} className="space-y-10">
        <CheckoutStepHeader
          icon={UserRound}
          title="Datos del cliente"
          subtitle="Completa tus datos para generar el comprobante y recibir actualizaciones de tu pedido."
        />

        <CheckoutFormSection title="Identificación personal">
          <div className={checkoutFieldGridClassName}>
            <CheckoutField label={<>Nombres <RequiredMark /></>} htmlFor="firstName">
              <input
                id="firstName"
                type="text"
                required
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                className={checkoutInputClassName}
                placeholder="Juan Carlos"
              />
            </CheckoutField>

            <CheckoutField label={<>Apellidos <RequiredMark /></>} htmlFor="lastName">
              <input
                id="lastName"
                type="text"
                required
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                className={checkoutInputClassName}
                placeholder="Pérez Ramírez"
              />
            </CheckoutField>
          </div>
        </CheckoutFormSection>

        <CheckoutFormSection title="Documento de identidad">
          <div className={checkoutFieldGridClassName}>
            <CheckoutField label={<>Tipo de documento <RequiredMark /></>} htmlFor="documentType">
              <CheckoutSelect
                id="documentType"
                required
                value={form.documentType}
                onChange={(event) =>
                  updateField(
                    "documentType",
                    event.target.value as CheckoutCustomerForm["documentType"]
                  )
                }
              >
                {DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CheckoutSelect>
            </CheckoutField>

            <CheckoutField label={<>Número de documento <RequiredMark /></>} htmlFor="documentNumber">
              <input
                id="documentNumber"
                type="text"
                required
                minLength={6}
                maxLength={20}
                value={form.documentNumber}
                onChange={(event) => updateField("documentNumber", event.target.value)}
                className={checkoutInputClassName}
                placeholder="71987654"
              />
            </CheckoutField>
          </div>
        </CheckoutFormSection>

        <CheckoutFormSection title="Datos de contacto">
          <div className="space-y-6">
            <CheckoutField label={<>Correo electrónico <RequiredMark /></>} htmlFor="email">
              <input
                id="email"
                type="email"
                required
                readOnly
                value={form.email}
                className={`${checkoutInputClassName} bg-[#f8fafc] text-[#8b93a1]`}
              />
            </CheckoutField>

            <CheckoutField label={<>Teléfono / Celular <RequiredMark /></>} htmlFor="phone">
              <div className="relative">
                <MessageCircle className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#25d366]" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={`${checkoutInputClassName} pl-11`}
                  placeholder="987 654 321"
                />
              </div>
            </CheckoutField>
          </div>
        </CheckoutFormSection>

        <div className={checkoutNoticeClassName}>
          <span className="font-semibold">Importante:</span> Usaremos estos datos para enviarte el
          comprobante de pago y actualizaciones de tu pedido.
        </div>
      </form>
    </CheckoutStepShell>
  );
}
