"use client";

import { useEffect, useState } from "react";
import { Eye, ShoppingBag, Trash2 } from "lucide-react";

import { Toast } from "@/components/ui/toast";
import {
  formatOrderDate,
  formatOrderId,
  getOrderItemCount,
} from "@/features/account/utils/orderDisplay";
import { PaymentBrandImage } from "@/features/checkout/components/CheckoutPaymentLogos";
import type { PaymentBrand } from "@/features/checkout/constants/payment-brands";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import AdminOrderDetailModal from "@/features/admin/components/AdminOrderDetailModal";
import AdminOrderStatusSelect from "@/features/admin/components/AdminOrderStatusSelect";
import { AdminSearchBar } from "@/features/admin/components/AdminSearchBar";
import {
  AdminCard,
  AdminEmptyState,
  AdminTable,
  AdminTableHead,
  AdminTh,
} from "@/features/admin/components/AdminCard";
import {
  AdminBtnDanger,
  AdminBtnSecondary,
  AdminModal,
} from "@/features/admin/components/AdminModal";
import {
  deleteOrder,
  getOrderAdminById,
  getOrdersAdmin,
  reviewPaymentProof,
  updateOrderStatus,
} from "@/features/cart/services/orderService";
import { getPaymentMethodLabel } from "@/features/checkout/utils/payment";
import {
  EcommerceOrder,
  formatPrice,
  ORDER_STATUS_LABELS,
  OrderStatus,
  PAYMENT_PROOF_STATUS_LABELS,
  PaymentProofStatus,
} from "@/features/products/types/ecommerce";

const STATUS_OPTIONS = Object.values(OrderStatus);

const PAYMENT_PROOF_STATUS_COLORS: Record<PaymentProofStatus, string> = {
  [PaymentProofStatus.NOT_REQUIRED]:
    "bg-slate-50 text-slate-600 border border-slate-200",
  [PaymentProofStatus.PENDING]:
    "bg-amber-50 text-amber-700 border border-amber-200",
  [PaymentProofStatus.SUBMITTED]:
    "bg-sky-50 text-sky-700 border border-sky-200",
  [PaymentProofStatus.APPROVED]:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  [PaymentProofStatus.REJECTED]:
    "bg-red-50 text-red-700 border border-red-200",
};

function getPaymentBrand(method?: string | null): PaymentBrand | null {
  if (method === "yape" || method === "plin") return method;
  return null;
}

function getPaymentProofStatusLabel(status?: string | null) {
  if (!status) return "—";
  return PAYMENT_PROOF_STATUS_LABELS[status as PaymentProofStatus] ?? status;
}

function isWalletPayment(method?: string | null) {
  return method === "yape" || method === "plin";
}

export default function EcommerceOrdersPage() {
  const [orders, setOrders] = useState<EcommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selected, setSelected] = useState<EcommerceOrder | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reviewingPayment, setReviewingPayment] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EcommerceOrder | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersAdmin({
        search,
        limit: 50,
        status: statusFilter || undefined,
      });
      setOrders(res.data);
    } catch {
      setToast({ type: "error", message: "Error al cargar órdenes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleOpenOrder = async (order: EcommerceOrder) => {
    setSelected(order);
    setReviewNote("");
    setLoadingDetail(true);
    try {
      const detail = await getOrderAdminById(order.id);
      setSelected(detail);
    } catch {
      setToast({ type: "error", message: "No se pudo cargar el detalle de la orden." });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handlePaymentReview = async (action: "approve" | "reject") => {
    if (!selected) return;

    setReviewingPayment(true);
    try {
      const updated = await reviewPaymentProof(selected.id, {
        action,
        note: reviewNote.trim() || undefined,
      });
      setToast({
        type: "success",
        message:
          action === "approve"
            ? "Comprobante aprobado y pedido confirmado."
            : "Comprobante rechazado.",
      });
      setSelected(updated);
      setReviewNote("");
      fetchOrders();
    } catch {
      setToast({
        type: "error",
        message: "No se pudo procesar la revisión del comprobante.",
      });
    } finally {
      setReviewingPayment(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const current = orders.find((order) => order.id === orderId);
    if (!current || current.status === status) return;

    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { status });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
      setToast({ type: "success", message: "Estado actualizado." });
      if (selected?.id === orderId) {
        setSelected((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
      setToast({ type: "error", message: "No se pudo actualizar el estado." });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteOrder(deleteTarget.id);
      setToast({ type: "success", message: "Orden eliminada." });
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) {
        setSelected(null);
      }
      fetchOrders();
    } catch {
      setToast({ type: "error", message: "No se pudo eliminar la orden." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full">
      {toast ? (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}

      <AdminPageHeader
        icon={ShoppingBag}
        title="Órdenes de tienda"
        description="Gestiona los pedidos generados por los clientes"
      />

      <AdminSearchBar
        value={search}
        onChange={setSearch}
        onSearch={fetchOrders}
        placeholder="Buscar por cliente o ID..."
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </AdminSearchBar>

      <AdminCard>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-slate-900">
            {loading ? "Cargando órdenes..." : `${orders.length} orden${orders.length !== 1 ? "es" : ""}`}
          </p>
          {statusFilter ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
              Filtro: {ORDER_STATUS_LABELS[statusFilter]}
            </span>
          ) : null}
        </div>

        <AdminTable className="min-w-[1180px]">
          <AdminTableHead>
            <tr>
              <AdminTh className="w-[120px]">Orden</AdminTh>
              <AdminTh className="min-w-[200px]">Cliente</AdminTh>
              <AdminTh className="w-[80px] text-center">Items</AdminTh>
              <AdminTh className="w-[110px]">Total</AdminTh>
              <AdminTh className="min-w-[180px]">Pago</AdminTh>
              <AdminTh className="min-w-[170px]">Estado</AdminTh>
              <AdminTh className="min-w-[180px]">Fecha</AdminTh>
              <AdminTh align="right" className="w-[120px]">
                Acciones
              </AdminTh>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <AdminEmptyState message="Cargando órdenes..." colSpan={8} />
            ) : orders.length === 0 ? (
              <AdminEmptyState message="No hay órdenes registradas" colSpan={8} />
            ) : (
              orders.map((order) => {
                const paymentBrand = getPaymentBrand(order.paymentMethod);
                const itemCount = getOrderItemCount(order);
                const isUpdatingStatus = updatingOrderId === order.id;

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <p className="font-mono text-sm font-bold text-slate-900">
                        #{formatOrderId(order.id)}
                      </p>
                    </td>

                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <p className="font-semibold text-slate-900">
                        {order.user?.fullName ?? order.customerFullName ?? "—"}
                      </p>
                      <p className="mt-1 max-w-[280px] truncate text-xs text-slate-500">
                        {order.user?.email ?? order.customerEmail ?? "—"}
                      </p>
                    </td>

                    <td className="px-5 py-5 text-center sm:px-6 lg:px-8">
                      <span className="inline-flex min-w-[2.25rem] items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                        {itemCount}
                      </span>
                    </td>

                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <p className="whitespace-nowrap text-sm font-bold text-slate-900">
                        {formatPrice(order.total)}
                      </p>
                    </td>

                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <div className="flex items-center gap-3">
                        {paymentBrand ? (
                          <PaymentBrandImage brand={paymentBrand} size="sm" />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                            $
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">
                            {order.paymentMethod
                              ? getPaymentMethodLabel(
                                  order.paymentMethod as "yape" | "plin" | "cash"
                                )
                              : "—"}
                          </p>
                          {isWalletPayment(order.paymentMethod) ? (
                            <span
                              className={[
                                "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                                PAYMENT_PROOF_STATUS_COLORS[
                                  (order.paymentProofStatus as PaymentProofStatus) ||
                                    PaymentProofStatus.PENDING
                                ],
                              ].join(" ")}
                            >
                              {getPaymentProofStatusLabel(order.paymentProofStatus)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <AdminOrderStatusSelect
                        value={order.status}
                        disabled={isUpdatingStatus}
                        onChange={(status) => handleStatusChange(order.id, status)}
                      />
                    </td>

                    <td className="px-5 py-5 sm:px-6 lg:px-8">
                      <p className="whitespace-nowrap text-sm text-slate-700">
                        {formatOrderDate(order.createdAt, { includeTime: true })}
                      </p>
                    </td>

                    <td className="px-5 py-5 text-right sm:px-6 lg:px-8">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenOrder(order)}
                          className="rounded-lg p-2 text-blue-700 transition-colors hover:bg-blue-50"
                          aria-label="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(order)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          aria-label="Eliminar orden"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </AdminTable>
      </AdminCard>

      {selected ? (
        <AdminOrderDetailModal
          order={selected}
          loadingDetail={loadingDetail}
          reviewingPayment={reviewingPayment}
          reviewNote={reviewNote}
          onReviewNoteChange={setReviewNote}
          onPaymentReview={handlePaymentReview}
          onClose={() => setSelected(null)}
        />
      ) : null}

      {deleteTarget ? (
        <AdminModal
          title="Eliminar orden"
          onClose={() => setDeleteTarget(null)}
          size="sm"
          footer={
            <>
              <AdminBtnSecondary onClick={() => setDeleteTarget(null)}>
                Cancelar
              </AdminBtnSecondary>
              <AdminBtnDanger onClick={handleDelete} disabled={deleting}>
                {deleting ? "Eliminando..." : "Eliminar"}
              </AdminBtnDanger>
            </>
          }
        >
          <p className="text-sm text-slate-600">
            Se registrará un bloque DELETED en la blockchain y la orden se
            eliminará permanentemente del sistema.
          </p>
        </AdminModal>
      ) : null}
    </div>
  );
}
