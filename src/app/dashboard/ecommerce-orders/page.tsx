"use client";

import { useEffect, useState } from "react";
import { Eye, ShoppingBag } from "lucide-react";

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
  AdminBtnSecondary,
  AdminModal,
} from "@/app/dashboard/components/AdminModal";
import {
  getOrdersAdmin,
  updateOrderStatus,
} from "@/services/ecommerceOrderService";
import {
  EcommerceOrder,
  formatPrice,
  ORDER_STATUS_LABELS,
  OrderStatus,
} from "@/types/ecommerce";

const STATUS_OPTIONS = Object.values(OrderStatus);

export default function EcommerceOrdersPage() {
  const [orders, setOrders] = useState<EcommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selected, setSelected] = useState<EcommerceOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  return (
    <div className="max-w-6xl">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

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
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
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
              <AdminEmptyState message="No hay órdenes registradas" colSpan={6} />
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{order.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-900">{order.user?.fullName ?? "—"}</p>
                    <p className="text-xs text-slate-500">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3.5">
                    <select
                      value={order.status}
                      disabled={updating || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("es-PE")}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(order)}
                      className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
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
          onClose={() => setSelected(null)}
          footer={<AdminBtnSecondary onClick={() => setSelected(null)}>Cerrar</AdminBtnSecondary>}
        >
          <div className="space-y-2 text-sm mb-4">
            <p><span className="text-slate-500">Cliente:</span> {selected.user?.fullName}</p>
            <p><span className="text-slate-500">Email:</span> {selected.user?.email}</p>
            <p><span className="text-slate-500">Teléfono:</span> {selected.contactPhone || "—"}</p>
            <p><span className="text-slate-500">Dirección:</span> {selected.shippingAddress || "—"}</p>
            <p><span className="text-slate-500">Notas:</span> {selected.notes || "—"}</p>
            <p><span className="text-slate-500">Estado:</span> {ORDER_STATUS_LABELS[selected.status]}</p>
          </div>
          <ul className="border-t border-slate-100 pt-4 space-y-2 mb-4">
            {selected.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span>{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold text-lg flex justify-between border-t pt-4">
            <span>Total</span>
            <span className="text-blue-700">{formatPrice(selected.total)}</span>
          </p>
        </AdminModal>
      )}
    </div>
  );
}
