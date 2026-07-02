"use client";

import { ArrowLeft, ArrowRight, ClipboardCheck, Lock, MessageCircle } from "lucide-react";
import Link from "next/link";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  checkoutActionsClassName,
  checkoutTextareaClassName,
  CheckoutStepHeader,
  CheckoutStepShell,
} from "@/features/checkout/components/checkoutUi";
import {
  DOCUMENT_TYPE_OPTIONS,
  type CheckoutCustomerForm,
  type CheckoutFormState,
  type CheckoutStep,
} from "@/features/checkout/types";
import { getPaymentMethodLabel, requiresPaymentProof } from "@/features/checkout/utils/payment";
import { getDeliveryTypeLabel } from "@/features/checkout/utils/shipping";

interface CheckoutConfirmStepProps {
  form: CheckoutFormState;
  loading: boolean;
  onEditStep: (step: CheckoutStep) => void;
  onBack: () => void;
  onSubmit: () => void;
  onOrderNotesChange: (notes: string) => void;
}

function getDocumentLabel(documentType: CheckoutCustomerForm["documentType"]) {
  return DOCUMENT_TYPE_OPTIONS.find((option) => option.value === documentType)?.label ?? documentType;
}

function SectionHeader({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#e8ebf0] pb-4">
      <h3 className="text-[16px] font-bold text-[#17245c]">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        className="text-[13px] font-semibold text-[#17245c] underline-offset-2 hover:underline"
      >
        Editar
      </button>
    </div>
  );
}

function PhoneValue({ phone }: { phone: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MessageCircle className="h-4 w-4 text-[#25d366]" aria-hidden />
      {phone}
    </span>
  );
}

function InfoLine({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-[#5b6472]">{children}</p>;
}

export default function CheckoutConfirmStep({
  form,
  loading,
  onEditStep,
  onBack,
  onSubmit,
  onOrderNotesChange,
}: CheckoutConfirmStepProps) {
  const fullName = [form.customer.firstName, form.customer.lastName].filter(Boolean).join(" ");
  const isHomeDelivery = form.shipping.deliveryType === "home";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  const footer = (
    <div className={checkoutActionsClassName}>
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={loading}
        className="h-12 rounded-xl border-[#d7dce5] px-6 text-[#17245c] hover:bg-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>
      <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
        <Button
          type="submit"
          form="checkout-confirm-form"
          disabled={loading}
          className="h-12 rounded-xl bg-[#17245c] px-10 text-[15px] font-bold hover:bg-[#111a45]"
        >
          <Lock className="mr-2 h-4 w-4" />
          {loading ? "Confirmando pedido..." : "Confirmar pedido"}
          {!loading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
        </Button>
        <p className="text-center text-[12px] text-[#8b93a1] sm:text-right">
          Al confirmar aceptas nuestros{" "}
          <Link href="/landing" className="font-semibold text-[#17245c] underline-offset-2 hover:underline">
            Términos y Condiciones
          </Link>
          .
        </p>
      </div>
    </div>
  );

  return (
    <CheckoutStepShell footer={footer}>
      <form id="checkout-confirm-form" onSubmit={handleSubmit} className="space-y-10">
        <CheckoutStepHeader
          icon={ClipboardCheck}
          title="Confirmación de tu pedido"
          subtitle="Revisa y confirma tu pedido antes de finalizar la compra."
        />

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#e8ebf0] bg-[#fafbfc] p-6 lg:p-7">
            <SectionHeader title="Datos del cliente" onEdit={() => onEditStep(1)} />
            <div className="mt-5 space-y-3">
              <p className="text-[16px] font-bold text-[#17245c]">{fullName}</p>
              <InfoLine>
                {getDocumentLabel(form.customer.documentType)}: {form.customer.documentNumber}
              </InfoLine>
              <InfoLine>{form.customer.email}</InfoLine>
              <InfoLine>
                <PhoneValue phone={form.customer.phone} />
              </InfoLine>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e8ebf0] bg-[#fafbfc] p-6 lg:p-7">
            <SectionHeader title="Información de envío" onEdit={() => onEditStep(2)} />
            <div className="mt-5 space-y-3">
              <p className="text-[15px] font-semibold text-[#17245c]">
                {getDeliveryTypeLabel(form.shipping.deliveryType)}
              </p>
              {isHomeDelivery ? (
                <>
                  {form.shipping.address ? <InfoLine>{form.shipping.address}</InfoLine> : null}
                  {form.shipping.reference ? <InfoLine>{form.shipping.reference}</InfoLine> : null}
                  <InfoLine>
                    {form.shipping.department}, {form.shipping.province}, {form.shipping.district}
                  </InfoLine>
                  {form.shipping.postalCode ? (
                    <InfoLine>Código postal: {form.shipping.postalCode}</InfoLine>
                  ) : null}
                </>
              ) : (
                <InfoLine>Recojo en tienda / almacén — te contactaremos para coordinar.</InfoLine>
              )}
              <InfoLine>
                Contacto entrega: <PhoneValue phone={form.shipping.contactPhone} />
              </InfoLine>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e8ebf0] bg-[#fafbfc] p-6 lg:p-7">
            <SectionHeader title="Información de pago" onEdit={() => onEditStep(3)} />
            <div className="mt-5 space-y-3">
              <p className="text-[15px] font-semibold text-[#17245c]">
                {getPaymentMethodLabel(form.payment.method)}
              </p>
              <InfoLine>
                {form.payment.method === "cash"
                  ? "Pagarás en efectivo al recibir o recoger tu pedido."
                  : "Tu comprobante será revisado por nuestro equipo antes de confirmar el pedido."}
              </InfoLine>
              {requiresPaymentProof(form.payment.method) && form.payment.proofPreview ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-[#e3e7ee] bg-white">
                  <div className="relative aspect-[4/3] w-full max-w-xs">
                    <Image
                      src={form.payment.proofPreview}
                      alt="Comprobante de pago"
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-[#e8ebf0] bg-white p-6 lg:p-7">
            <h3 className="text-[16px] font-bold text-[#17245c]">Notas adicionales</h3>
            <p className="mt-2 text-[14px] text-[#8b93a1]">
              Opcional — instrucciones especiales para tu pedido.
            </p>
            <textarea
              value={form.orderNotes}
              onChange={(event) => onOrderNotesChange(event.target.value)}
              rows={4}
              placeholder="Ejemplo: Horario de atención, instrucciones especiales, etc."
              className={`${checkoutTextareaClassName} mt-4`}
            />
          </section>
        </div>
      </form>
    </CheckoutStepShell>
  );
}
