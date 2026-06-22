"use client";
import { useState } from "react";
import { Blocks, ChevronDown, Link2, ShoppingBag, Trash2, User } from "lucide-react";
import { AdminCard } from "@/features/admin/components/AdminCard";
import { BlockchainTimeline } from "./BlockchainTimeline";
import { OrderIntegrityCheck } from "./OrderIntegrityCheck";
import type { BlockchainBlock } from "@/features/admin/blockchain/types/blockchain";
import { formatPrice } from "@/features/products/types/ecommerce";

interface OrderAuditCardProps {
  orderId: string;
  blocks: BlockchainBlock[];
  defaultExpanded?: boolean;
  onRequestDeleteHistory?: () => void;
  deletingHistory?: boolean;
}

function getCreatedSnapshot(blocks: BlockchainBlock[]) {
  const created = blocks.find((b) => b.action === "CREATED");
  if (!created) return null;

  const data = created.data;

  return {
    total: typeof data.total === "number" ? data.total : Number(data.total),
    createdAt: created.timestamp,
    status: typeof data.status === "string" ? data.status : undefined,
    customerName: created.performedByUser?.fullName,
    customerEmail: created.performedByUser?.email,
  };
}

export function OrderAuditCard({
  orderId,
  blocks,
  defaultExpanded = false,
  onRequestDeleteHistory,
  deletingHistory = false,
}: OrderAuditCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const snapshot = getCreatedSnapshot(blocks);
  const actionCount = blocks.reduce<Record<string, number>>((acc, b) => {
    acc[b.action] = (acc[b.action] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AdminCard>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 sm:px-5 py-4 flex items-start sm:items-center justify-between gap-4 text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-blue-700 text-white shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Auditoría de orden
            </p>

            {/* Nombre del cliente */}
            {snapshot?.customerName ? (
              <div className="flex items-center gap-1.5 mt-0.5 mb-0.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {snapshot.customerName}
                </p>
                {snapshot.customerEmail && (
                  <p className="text-xs text-slate-400 truncate hidden sm:block">
                    · {snapshot.customerEmail}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-500 truncate mt-0.5">
                Cliente no identificado
              </p>
            )}

            {/* ID de orden */}
            <p className="font-mono text-xs text-slate-400 truncate">
              {orderId}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Blocks className="w-3.5 h-3.5" />
                {blocks.length} bloque{blocks.length !== 1 ? "s" : ""}
              </span>
              {snapshot && (
                <span className="text-xs font-semibold text-emerald-700">
                  {formatPrice(snapshot.total)}
                </span>
              )}
              {Object.entries(actionCount).map(([action, count]) => (
                <span
                  key={action}
                  className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600"
                >
                  {action} · {count}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
          <OrderIntegrityCheck orderId={orderId} />
          <div className="rounded-xl bg-slate-50/80 border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-medium text-slate-900">
                Historial de bloques de esta orden
              </p>
            </div>
            <BlockchainTimeline
              blocks={blocks}
              emptyMessage="Sin bloques para esta orden."
            />
          </div>

          {onRequestDeleteHistory && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onRequestDeleteHistory}
                disabled={deletingHistory}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deletingHistory ? "Eliminando historial…" : "Eliminar historial de auditoría"}
              </button>
            </div>
          )}
        </div>
      )}
    </AdminCard>
  );
}