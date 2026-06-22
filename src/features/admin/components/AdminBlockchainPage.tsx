"use client";

import { useEffect, useMemo, useState } from "react";
import { Blocks, Link2, RefreshCw, ShoppingBag } from "lucide-react";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminCard } from "@/features/admin/components/AdminCard";
import {
  AdminBtnDanger,
  AdminBtnSecondary,
  AdminModal,
} from "@/features/admin/components/AdminModal";
import { Toast } from "@/components/ui/toast";
import { BlockCard } from "@/features/admin/blockchain/components/BlockCard";
import { BlockchainValidation } from "@/features/admin/blockchain/components/BlockchainValidation";
import { OrderAuditCard } from "@/features/admin/blockchain/components/OrderAuditCard";
import {
  deleteOrderBlockchainHistory,
  getBlockchain,
} from "@/features/admin/blockchain/services/blockchainService";
import type { BlockchainBlock } from "@/features/admin/blockchain/types/blockchain";
import { BLOCKCHAIN_ACTION_LABELS } from "@/features/admin/blockchain/types/blockchain";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof Blocks;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className={`inline-flex p-2.5 rounded-xl mb-3 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

export default function BlockchainPage() {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteHistoryTarget, setDeleteHistoryTarget] = useState<string | null>(null);
  const [deletingHistory, setDeletingHistory] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchChain = async () => {
    try {
      setLoading(true);
      const data = await getBlockchain();
      setBlocks(data);
    } catch {
      setToast({ type: "error", message: "Error al cargar la blockchain." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChain();
  }, []);

  const handleDeleteHistory = async () => {
    if (!deleteHistoryTarget) return;

    setDeletingHistory(true);
    try {
      const result = await deleteOrderBlockchainHistory(deleteHistoryTarget);
      setToast({
        type: "success",
        message: `Historial eliminado (${result.deletedBlocks} bloque${result.deletedBlocks !== 1 ? "s" : ""}).`,
      });
      setDeleteHistoryTarget(null);
      await fetchChain();
    } catch {
      setToast({
        type: "error",
        message: "No se pudo eliminar el historial de auditoría.",
      });
    } finally {
      setDeletingHistory(false);
    }
  };

  const stats = useMemo(() => {
    const orderBlocks = blocks.filter((b) => b.orderId !== "GENESIS");
    const uniqueOrders = new Set(orderBlocks.map((b) => b.orderId)).size;
    const byAction = blocks.reduce<Record<string, number>>((acc, b) => {
      acc[b.action] = (acc[b.action] ?? 0) + 1;
      return acc;
    }, {});
    return { orderBlocks: orderBlocks.length, uniqueOrders, byAction };
  }, [blocks]);

  const orderAudits = useMemo(() => {
    const groups = new Map<string, BlockchainBlock[]>();
    for (const block of blocks) {
      if (block.orderId === "GENESIS") continue;
      const existing = groups.get(block.orderId) ?? [];
      existing.push(block);
      groups.set(block.orderId, existing);
    }
    return Array.from(groups.entries())
      .map(([orderId, orderBlocks]) => ({
        orderId,
        blocks: [...orderBlocks].sort((a, b) => a.blockIndex - b.blockIndex),
        latestTimestamp: orderBlocks.reduce(
          (latest, block) =>
            new Date(block.timestamp) > new Date(latest) ? block.timestamp : latest,
          orderBlocks[0].timestamp,
        ),
      }))
      .sort(
        (a, b) =>
          new Date(b.latestTimestamp).getTime() - new Date(a.latestTimestamp).getTime(),
      );
  }, [blocks]);

  const genesisBlock = useMemo(
    () => blocks.find((b) => b.orderId === "GENESIS" || b.action === "GENESIS"),
    [blocks],
  );

  return (
    <div className="max-w-4xl space-y-8">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <AdminPageHeader
        icon={Link2}
        title="Blockchain de auditoría"
        description="Cada orden tiene su propio registro inmutable e independiente"
        actions={
          <button
            type="button"
            onClick={fetchChain}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        }
      />

      {/* Validación */}
      <section>
        <BlockchainValidation />
      </section>

      {/* Stats */}
      {!loading && blocks.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Resumen
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Bloques totales"
              value={blocks.length}
              icon={Blocks}
              accent="bg-slate-100 text-slate-700"
            />
            <StatCard
              label="Bloques de órdenes"
              value={stats.orderBlocks}
              icon={ShoppingBag}
              accent="bg-blue-100 text-blue-700"
            />
            <StatCard
              label="Órdenes auditadas"
              value={stats.uniqueOrders}
              icon={Link2}
              accent="bg-violet-100 text-violet-700"
            />
            <StatCard
              label="Cambios de estado"
              value={stats.byAction.STATUS_CHANGED ?? 0}
              icon={RefreshCw}
              accent="bg-emerald-100 text-emerald-700"
            />
          </div>
        </section>
      )}

      {/* Leyenda de acciones */}
      {!loading && blocks.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Tipos de acción
          </h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-2">
            {Object.entries(BLOCKCHAIN_ACTION_LABELS).map(([action, label]) => (
              <span
                key={action}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600"
              >
                <span className="font-mono font-semibold text-slate-800">{action}</span>
                <span className="text-slate-300">·</span>
                {label}
                {stats.byAction[action] != null && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-200 font-semibold text-slate-700">
                    {stats.byAction[action]}
                  </span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Auditorías por orden */}
      <section>
        {loading ? (
          <AdminCard>
            <div className="flex flex-col items-center py-16">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm text-slate-500">Cargando auditorías…</p>
            </div>
          </AdminCard>
        ) : orderAudits.length === 0 ? (
          <AdminCard>
            <p className="px-4 py-12 text-sm text-slate-500 text-center">
              Aún no hay órdenes registradas en la blockchain.
            </p>
          </AdminCard>
        ) : (
          <>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Auditorías por orden
              <span className="ml-2 normal-case font-normal text-slate-400">
                — {orderAudits.length} orden{orderAudits.length !== 1 ? "es" : ""}
              </span>
            </h2>
            <div className="space-y-3">
              {orderAudits.map((audit) => (
                <OrderAuditCard
                  key={audit.orderId}
                  orderId={audit.orderId}
                  blocks={audit.blocks}
                  onRequestDeleteHistory={() => setDeleteHistoryTarget(audit.orderId)}
                  deletingHistory={deletingHistory && deleteHistoryTarget === audit.orderId}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Bloque génesis */}
      {!loading && genesisBlock && (
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Bloque génesis
          </h2>
          <AdminCard>
            <div className="px-5 py-4 border-b border-slate-100 bg-violet-50/60 rounded-t-xl">
              <p className="text-sm font-semibold text-violet-900">Punto de origen del sistema</p>
              <p className="text-xs text-violet-500 mt-0.5">
                Bloque compartido que ancla toda la cadena de auditoría
              </p>
            </div>
            <div className="p-5">
              <BlockCard block={genesisBlock} />
            </div>
          </AdminCard>
        </section>
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
            Se eliminarán todos los bloques de auditoría de la orden{" "}
            <span className="font-mono text-slate-800">{deleteHistoryTarget}</span>.
            La cadena se reparará automáticamente. La orden en el sistema no se
            borra con esta acción.
          </p>
        </AdminModal>
      )}
    </div>
  );
}