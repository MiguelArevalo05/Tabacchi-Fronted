"use client";

import { useEffect, useState } from "react";
import { Eye, Link2, ShoppingBag, Trash2 } from "lucide-react";

import { Toast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/app/dashboard/components/AdminPageHeader";
import { AdminSearchBar } from "@/app/dashboard/components/AdminSearchBar";
import {
  AdminCard,
  AdminEmptyState,
  AdminTable,
  AdminTableHead,
  AdminTh,
} from "@/app/dashboard/components/AdminCard";
import {
  AdminBtnDanger,
  AdminBtnSecondary,
  AdminModal,
} from "@/app/dashboard/components/AdminModal";
import { OrderIntegrityCheck } from "@/components/blockchain/OrderIntegrityCheck";
import { deleteOrderBlockchainHistory } from "@/services/blockchainService";
import {
  deleteOrder,
  getOrdersAdmin,
  updateOrderStatus,
} from "@/services/ecommerceOrderService";
import {
  CartItemType,
  EcommerceOrder,
  formatPrice,
  ORDER_STATUS_LABELS,
  OrderStatus,
} from "@/types/ecommerce";

const STATUS_OPTIONS = Object.values(OrderStatus);

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:
    "bg-yellow-50 text-yellow-700 border border-yellow-200",
  [OrderStatus.CONFIRMED]: "bg-blue-50 text-blue-700 border border-blue-200",
  [OrderStatus.PROCESSING]:
    "bg-purple-50 text-purple-700 border border-purple-200",
  [OrderStatus.SHIPPED]:
    "bg-indigo-50 text-indigo-700 border border-indigo-200",
  [OrderStatus.DELIVERED]: "bg-green-50 text-green-700 border border-green-200",
  [OrderStatus.CANCELLED]: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_BTN_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-500 hover:bg-yellow-600 text-white",
  [OrderStatus.CONFIRMED]: "bg-blue-500 hover:bg-blue-600 text-white",
  [OrderStatus.PROCESSING]: "bg-purple-500 hover:bg-purple-600 text-white",
  [OrderStatus.SHIPPED]: "bg-indigo-500 hover:bg-indigo-600 text-white",
  [OrderStatus.DELIVERED]: "bg-green-500 hover:bg-green-600 text-white",
  [OrderStatus.CANCELLED]: "bg-red-500 hover:bg-red-600 text-white",
};

const TERMINAL_STATUSES = [OrderStatus.DELIVERED, OrderStatus.CANCELLED];

export default function EcommerceOrdersPage() {
  const [orders, setOrders] = useState<EcommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selected, setSelected] = useState<EcommerceOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EcommerceOrder | null>(null);
  const [deleteHistoryTarget, setDeleteHistoryTarget] = useState<string | null>(null);
  const [deletingHistory, setDeletingHistory] = useState(false);
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

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, { status });
      setToast({ type: "success", message: "Estado actualizado." });
      fetchOrders();
      if (selected?.id === orderId) {
        setSelected((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
      setToast({ type: "error", message: "No se pudo actualizar el estado." });
    } finally {
      setUpdating(false);
    }
  };

  const isTerminal = (status: OrderStatus) =>
    TERMINAL_STATUSES.includes(status);

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

  const handleDeleteHistory = async () => {
    if (!deleteHistoryTarget) return;

    setDeletingHistory(true);
    try {
      const result = await deleteOrderBlockchainHistory(deleteHistoryTarget);
      setToast({
        type: "success",
        message: `Historial blockchain eliminado (${result.deletedBlocks} bloque${result.deletedBlocks !== 1 ? "s" : ""}).`,
      });
      setDeleteHistoryTarget(null);
    } catch {
      setToast({
        type: "error",
        message: "No se pudo eliminar el historial de auditoría.",
      });
    } finally {
      setDeletingHistory(false);
    }
  };

  return (
    <div className="max-w-6xl">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

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
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTh>ID</AdminTh>
              <AdminTh>Cliente</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh>Estado</AdminTh>
              <AdminTh>Fecha</AdminTh>
              <AdminTh align="right">Acciones</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <AdminEmptyState message="Cargando órdenes..." colSpan={6} />
            ) : orders.length === 0 ? (
              <AdminEmptyState
                message="No hay órdenes registradas"
                colSpan={6}
              />
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                    {order.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-900">
                      {order.user?.fullName ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.user?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("es-PE")}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(order)}
                      className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(order)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-1 transition-colors"
                      aria-label="Eliminar orden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </AdminTable>
      </AdminCard>

      {selected && (
        <AdminModal
          title="Detalle de orden"
          size="lg"
          onClose={() => setSelected(null)}
          footer={
            <>
              <AdminBtnDanger
                onClick={() => setDeleteTarget(selected)}
                className="inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar orden
              </AdminBtnDanger>
              <AdminBtnSecondary
                onClick={() => setDeleteHistoryTarget(selected.id)}
                className="inline-flex items-center gap-2 text-red-700 border-red-200 hover:bg-red-50"
              >
                <Link2 className="w-4 h-4" />
                Limpiar historial blockchain
              </AdminBtnSecondary>
              <AdminBtnSecondary onClick={() => setSelected(null)}>
                Cerrar
              </AdminBtnSecondary>
            </>
          }
        >
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Auditoría blockchain
              </p>
            </div>
            <OrderIntegrityCheck orderId={selected.id} />
          </div>

          {/* Info del cliente */}
          <div className="bg-slate-50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                Cliente
              </p>
              <p className="font-semibold text-slate-900 text-sm">
                {selected.user?.fullName}
              </p>
              <p className="text-xs text-slate-500">{selected.user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                Teléfono
              </p>
              <p className="text-sm text-slate-800">
                {selected.contactPhone || "—"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                Dirección de envío
              </p>
              <p className="text-sm text-slate-800">
                {selected.shippingAddress || "—"}
              </p>
            </div>
            {selected.notes && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                  Notas
                </p>
                <p className="text-sm text-slate-800">{selected.notes}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                Estado actual
              </p>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[selected.status]}`}
              >
                {ORDER_STATUS_LABELS[selected.status]}
              </span>
            </div>
          </div>

          {/* Cambiar estado */}
          {!isTerminal(selected.status) && (
            <div className="mb-5">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                Cambiar estado
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.filter((s) => s !== selected.status).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusChange(selected.id, s)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-opacity disabled:opacity-50 ${STATUS_BTN_COLORS[s]}`}
                    >
                      {ORDER_STATUS_LABELS[s]}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
            Items del pedido
          </p>
          <ul className="space-y-2 mb-4">
            {selected.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-3 py-2.5 text-sm"
              >
                <span className="text-slate-800">
                  <span className="inline-flex mr-2 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                    {item.itemType === CartItemType.SERVICE ? "Servicio" : "Producto"}
                  </span>
                  {item.productName}
                  <span className="ml-1.5 text-slate-400 font-normal">
                    × {item.quantity}
                  </span>
                </span>
                <span className="font-medium text-slate-900">
                  {formatPrice(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="font-semibold text-slate-700">Total</span>
            <span className="text-lg font-bold text-blue-700">
              {formatPrice(selected.total)}
            </span>
          </div>
        </AdminModal>
      )}

      {deleteHistoryTarget && (
        <AdminModal
          title="Eliminar historial de auditoría"
          onClose={() => !deletingHistory && setDeleteHistoryTarget(null)}
          size="sm"
          footer={
            <>
              <AdminBtnSecondary
                onClick={() => setDeleteHistoryTarget(null)}
                disabled={deletingHistory}
              >
                Cancelar
              </AdminBtnSecondary>
              <AdminBtnDanger onClick={handleDeleteHistory} disabled={deletingHistory}>
                {deletingHistory ? "Eliminando..." : "Eliminar historial"}
              </AdminBtnDanger>
            </>
          }
        >
          <p className="text-slate-600 text-sm">
            Se eliminarán los bloques de auditoría de esta orden en la blockchain.
            La orden en el sistema no se borra. La cadena se repara automáticamente.
          </p>
        </AdminModal>
      )}

      {deleteTarget && (
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
          <p className="text-slate-600 text-sm">
            Se registrará un bloque DELETED en la blockchain y la orden se
            eliminará permanentemente del sistema.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
