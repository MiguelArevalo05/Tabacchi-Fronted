"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  Headphones,
  MessageCircle,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { CheckoutStepShell } from "@/features/checkout/components/checkoutUi";
import { formatPublicOrderNumber, formatOrderSuccessDate } from "@/features/checkout/utils/orderNumber";
import { getPaymentMethodLabel, requiresPaymentProof } from "@/features/checkout/utils/payment";
import { getDeliveryTypeLabel } from "@/features/checkout/utils/shipping";
import type { CheckoutFormState } from "@/features/checkout/types";
import { EcommerceOrder, formatPrice } from "@/features/products/types/ecommerce";

interface CheckoutOrderSuccessProps {
  order: EcommerceOrder;
  form: CheckoutFormState;
  supportPhone: string;
}

function downloadOrderReceipt(order: EcommerceOrder, form: CheckoutFormState) {
  const orderNumber = formatPublicOrderNumber(order);
  const lines = [
    "GRUPO TABACCHI — Comprobante de pedido",
    "========================================",
    `Número de pedido: ${orderNumber}`,
    `Fecha: ${formatOrderSuccessDate(order.createdAt)}`,
    `Cliente: ${[form.customer.firstName, form.customer.lastName].filter(Boolean).join(" ")}`,
    `Correo: ${form.customer.email}`,
    `Teléfono: ${form.customer.phone}`,
    "",
    "Productos y servicios:",
    ...order.items.map(
      (item) =>
        `- ${item.productName} x${item.quantity} — ${formatPrice(item.subtotal)}`
    ),
    "",
    `Subtotal: ${formatPrice(order.subtotal ?? 0)}`,
    `IGV: ${formatPrice(order.igv ?? 0)}`,
    `Total: ${formatPrice(order.total)}`,
    "",
    `Envío: ${getDeliveryTypeLabel(form.shipping.deliveryType)}`,
    `Pago: ${getPaymentMethodLabel(form.payment.method)}`,
    form.orderNotes ? `Notas: ${form.orderNotes}` : "",
  ].filter(Boolean);

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${orderNumber}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function CheckoutOrderSuccess({
  order,
  form,
  supportPhone,
}: CheckoutOrderSuccessProps) {
  const orderNumber = formatPublicOrderNumber(order);
  const whatsappHref = `https://wa.me/51${supportPhone.replace(/\D/g, "")}`;
  const walletPayment = requiresPaymentProof(form.payment.method);

  const recommendedActions = [
    {
      href: `/cuenta/ordenes/${order.id}`,
      title: "Ver mis pedidos",
      description: "Revisa el estado de tu pedido",
      icon: ClipboardList,
    },
    {
      href: "/productos",
      title: "Seguir comprando",
      description: "Explora más productos y servicios",
      icon: ShoppingBag,
    },
    {
      href: "#",
      title: "Descargar comprobante",
      description: "Guarda los detalles de tu pedido",
      icon: Download,
      onClick: () => downloadOrderReceipt(order, form),
    },
  ];

  return (
    <CheckoutStepShell>
      <div className="flex items-start gap-4 border-b border-[#eef1f5] pb-8">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f7ee] text-[#1f8f4a]">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-[24px] font-black leading-tight text-[#17245c] sm:text-[28px]">
            ¡Tu pedido ha sido generado con éxito!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5b6472] sm:text-[15px]">
            Gracias por confiar en Grupo Tabacchi. Hemos recibido tu pedido y lo estamos
            procesando.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#c6efd8] bg-[#f3fbf6] p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex flex-wrap items-baseline gap-2">
            <dt className="font-semibold text-[#17245c]">Número de pedido:</dt>
            <dd className="text-lg font-black text-[#1f8f4a]">{orderNumber}</dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <dt className="font-semibold text-[#17245c]">Fecha y hora:</dt>
            <dd className="text-[#5b6472]">{formatOrderSuccessDate(order.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#5b6472]">
        Te hemos enviado los detalles de tu pedido a tu correo electrónico{" "}
        <span className="font-semibold text-[#1f8f4a]">{form.customer.email}</span>
      </p>

      <section className="mt-8">
        <h3 className="text-[17px] font-bold text-[#17245c]">¿Qué sigue?</h3>
        <ul className="mt-4 space-y-4">
          <li className="flex gap-3 rounded-xl border border-[#e8ebf0] p-4">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#17245c]" />
            <p className="text-sm leading-relaxed text-[#5b6472]">
              {walletPayment
                ? "Hemos recibido tu comprobante de pago. Nuestro equipo lo verificará y te confirmará el pedido en breve."
                : "Nuestro equipo revisará tu pedido y se pondrá en contacto contigo para confirmar los detalles y coordinar la entrega."}
            </p>
          </li>
          <li className="flex gap-3 rounded-xl border border-[#e8ebf0] p-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#17245c]" />
            <p className="text-sm leading-relaxed text-[#5b6472]">
              Tiempo estimado de entrega: 24-48 horas para productos. Los servicios se coordinan
              según disponibilidad.
            </p>
          </li>
          <li className="flex gap-3 rounded-xl border border-[#e8ebf0] p-4">
            <Headphones className="mt-0.5 h-5 w-5 shrink-0 text-[#17245c]" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#17245c]">¿Necesitas ayuda?</p>
              <p className="mt-1 text-sm text-[#5b6472]">
                Escríbenos por WhatsApp y con gusto te atenderemos.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1da851]"
              >
                <MessageCircle className="h-4 w-4" />
                {supportPhone}
              </a>
            </div>
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h3 className="text-[17px] font-bold text-[#17245c]">Acciones recomendadas</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {recommendedActions.map((action) => {
            const Icon = action.icon;
            const content = (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef2f7] text-[#17245c]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-3 block text-sm font-bold text-[#17245c]">{action.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-[#8b93a1]">
                  {action.description}
                </span>
              </>
            );

            if (action.onClick) {
              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.onClick}
                  className="rounded-xl border border-[#e3e7ee] bg-white p-4 text-left transition hover:border-[#17245c] hover:bg-[#f8fbff]"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-xl border border-[#e3e7ee] bg-white p-4 transition hover:border-[#17245c] hover:bg-[#f8fbff]"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <p className="mt-6 rounded-xl border border-[#dbeafe] bg-[#f3f8ff] px-5 py-4 text-center text-[14px] leading-relaxed text-[#5b6472]">
        Te enviaremos actualizaciones a tu correo sobre el estado de tu pedido.
      </p>
    </CheckoutStepShell>
  );
}
