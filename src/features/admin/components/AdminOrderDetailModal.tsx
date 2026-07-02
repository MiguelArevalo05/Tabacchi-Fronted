"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  ChevronDown,
  CreditCard,
  Link2,
  MapPin,
  Package,
  Phone,
  StickyNote,
  UserRound,
} from "lucide-react";

import { getUploadImageUrl } from "@/lib/utils";
import { formatOrderDate, formatOrderId } from "@/features/account/utils/orderDisplay";
import { PaymentBrandImage } from "@/features/checkout/components/CheckoutPaymentLogos";
import type { PaymentBrand } from "@/features/checkout/constants/payment-brands";
import { getPaymentMethodLabel } from "@/features/checkout/utils/payment";
import { OrderIntegrityCheck } from "@/features/admin/blockchain/components/OrderIntegrityCheck";
import { AdminBtnSecondary, AdminModal } from "@/features/admin/components/AdminModal";
import {
  CartItemType,
  EcommerceOrder,
  formatPrice,
  ORDER_STATUS_LABELS,
  OrderStatus,
  PAYMENT_PROOF_STATUS_LABELS,
  PaymentProofStatus,
} from "@/features/products/types/ecommerce";

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-400/20 text-amber-100 ring-amber-300/30",
  [OrderStatus.CONFIRMED]: "bg-blue-400/20 text-blue-100 ring-blue-300/30",
  [OrderStatus.PROCESSING]: "bg-violet-400/20 text-violet-100 ring-violet-300/30",
  [OrderStatus.SHIPPED]: "bg-indigo-400/20 text-indigo-100 ring-indigo-300/30",
  [OrderStatus.DELIVERED]: "bg-emerald-400/20 text-emerald-100 ring-emerald-300/30",
  [OrderStatus.CANCELLED]: "bg-red-400/20 text-red-100 ring-red-300/30",
};

const PAYMENT_PROOF_STATUS_COLORS: Record<PaymentProofStatus, string> = {
  [PaymentProofStatus.NOT_REQUIRED]: "bg-slate-100 text-slate-600 ring-slate-200",
  [PaymentProofStatus.PENDING]: "bg-amber-50 text-amber-700 ring-amber-200",
  [PaymentProofStatus.SUBMITTED]: "bg-sky-50 text-sky-700 ring-sky-200",
  [PaymentProofStatus.APPROVED]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [PaymentProofStatus.REJECTED]: "bg-red-50 text-red-700 ring-red-200",
};

function getPaymentProofStatusLabel(status?: string | null) {
  if (!status) return "—";
  return PAYMENT_PROOF_STATUS_LABELS[status as PaymentProofStatus] ?? status;
}

function isWalletPayment(method?: string | null) {
  return method === "yape" || method === "plin";
}

interface AdminOrderDetailModalProps {
  order: EcommerceOrder;
  loadingDetail: boolean;
  reviewingPayment: boolean;
  reviewNote: string;
  onReviewNoteChange: (value: string) => void;
  onPaymentReview: (action: "approve" | "reject") => void;
  onClose: () => void;
}

export default function AdminOrderDetailModal({
  order,
  loadingDetail,
  reviewingPayment,
  reviewNote,
  onReviewNoteChange,
  onPaymentReview,
  onClose,
}: AdminOrderDetailModalProps) {
  const [showBlockchain, setShowBlockchain] = useState(false);
  const paymentBrand =
    order.paymentMethod === "yape" || order.paymentMethod === "plin"
      ? (order.paymentMethod as PaymentBrand)
      : null;
  const proofImageUrl = order.paymentProofUrl
    ? getUploadImageUrl(order.paymentProofUrl)
    : null;

  return (
    <AdminModal
      title={`Orden #${formatOrderId(order.id)}`}
      size="xl"
      onClose={onClose}
      footer={
        <div className="flex w-full justify-end">
          <AdminBtnSecondary onClick={onClose}>Cerrar</AdminBtnSecondary>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#17245c] to-slate-800 p-5 text-white shadow-lg sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                    STATUS_COLORS[order.status],
                  ].join(" ")}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                {isWalletPayment(order.paymentMethod) ? (
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/20">
                    {getPaymentProofStatusLabel(order.paymentProofStatus)}
                  </span>
                ) : null}
              </div>
              <div>
                <p className="text-sm text-white/60">Pedido realizado</p>
                <p className="mt-0.5 flex items-center gap-2 text-sm font-medium text-white/90">
                  <Calendar className="h-4 w-4 shrink-0 text-white/50" />
                  {formatOrderDate(order.createdAt, { includeTime: true })}
                </p>
              </div>
              <p className="font-mono text-[11px] text-white/40">{order.id}</p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur-sm lg:min-w-[200px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
                Total
              </p>
              <p className="mt-1 text-3xl font-black tracking-tight">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
              <UserRound className="h-4 w-4 text-blue-600" />
              Cliente y entrega
            </h3>
            <dl className="space-y-3.5 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Cliente
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {order.user?.fullName ?? order.customerFullName ?? "—"}
                </dd>
                {(order.user?.email || order.customerEmail) && (
                  <dd className="text-slate-500">
                    {order.user?.email ?? order.customerEmail}
                  </dd>
                )}
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Teléfono
                </dt>
                <dd className="mt-1 flex items-center gap-2 text-slate-800">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {order.contactPhone || order.customerPhone || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Dirección
                </dt>
                <dd className="mt-1 flex items-start gap-2 text-slate-800">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{order.shippingAddress || "—"}</span>
                </dd>
              </div>
              {order.notes ? (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Notas
                  </dt>
                  <dd className="mt-1 flex items-start gap-2 text-slate-800">
                    <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{order.notes}</span>
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
              <CreditCard className="h-4 w-4 text-blue-600" />
              Pago
            </h3>

            <div className="flex items-center gap-3 rounded-xl border border-white bg-white p-3 shadow-sm">
              {paymentBrand ? (
                <PaymentBrandImage brand={paymentBrand} size="md" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <CreditCard className="h-5 w-5 text-slate-500" />
                </span>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {order.paymentMethod
                    ? getPaymentMethodLabel(
                        order.paymentMethod as "yape" | "plin" | "cash"
                      )
                    : "—"}
                </p>
                {!isWalletPayment(order.paymentMethod) ? (
                  <p className="mt-0.5 text-xs text-slate-500">
                    Al momento de la entrega o recojo
                  </p>
                ) : null}
              </div>
            </div>

            {isWalletPayment(order.paymentMethod) ? (
              <div className="mt-4 space-y-3">
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
                    PAYMENT_PROOF_STATUS_COLORS[
                      (order.paymentProofStatus as PaymentProofStatus) ||
                        PaymentProofStatus.PENDING
                    ],
                  ].join(" ")}
                >
                  {getPaymentProofStatusLabel(order.paymentProofStatus)}
                </span>

                {loadingDetail ? (
                  <p className="text-sm text-slate-500">Cargando comprobante...</p>
                ) : proofImageUrl ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={proofImageUrl}
                        alt="Comprobante de pago"
                        fill
                        className="object-contain p-3"
                        unoptimized
                      />
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500">
                    Sin comprobante enviado
                  </p>
                )}

                {order.paymentProofReviewNote ? (
                  <p className="rounded-xl bg-white px-3 py-2.5 text-sm text-slate-700 ring-1 ring-slate-200">
                    <span className="font-semibold">Nota:</span>{" "}
                    {order.paymentProofReviewNote}
                  </p>
                ) : null}

                {order.paymentProofStatus === PaymentProofStatus.SUBMITTED ||
                order.paymentProofStatus === PaymentProofStatus.REJECTED ? (
                  <div className="space-y-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                    <textarea
                      value={reviewNote}
                      onChange={(event) => onReviewNoteChange(event.target.value)}
                      rows={2}
                      placeholder="Nota opcional..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={reviewingPayment || !order.paymentProofUrl}
                        onClick={() => onPaymentReview("approve")}
                        className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {reviewingPayment ? "..." : "Aprobar"}
                      </button>
                      <button
                        type="button"
                        disabled={reviewingPayment || !order.paymentProofUrl}
                        onClick={() => onPaymentReview("reject")}
                        className="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 sm:px-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Package className="h-4 w-4 text-blue-600" />
              Productos
              <span className="ml-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {order.items.length}
              </span>
            </h3>
          </div>

          <ul className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 px-4 py-4 sm:px-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                  ×{item.quantity}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      {item.itemType === CartItemType.SERVICE ? "Servicio" : "Producto"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {formatPrice(item.unitPrice)} c/u
                  </p>
                </div>
                <p className="shrink-0 text-base font-bold text-slate-900">
                  {formatPrice(item.subtotal)}
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-slate-100 bg-slate-50/50 px-4 py-4 text-sm sm:px-5">
            {order.subtotal != null ? (
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
            ) : null}
            {order.igv != null ? (
              <div className="flex justify-between text-slate-600">
                <span>IGV (18%)</span>
                <span>{formatPrice(order.igv)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-slate-200/80 pt-2 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <button
            type="button"
            onClick={() => setShowBlockchain((prev) => !prev)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 sm:px-5"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Link2 className="h-4 w-4 text-blue-600" />
              Auditoría blockchain
            </span>
            <ChevronDown
              className={[
                "h-4 w-4 text-slate-400 transition-transform duration-200",
                showBlockchain ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
          {showBlockchain ? (
            <div className="border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5">
              <OrderIntegrityCheck orderId={order.id} />
            </div>
          ) : null}
        </div>
      </div>
    </AdminModal>
  );
}
