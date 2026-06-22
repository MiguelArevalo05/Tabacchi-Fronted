"use client";

import { useState } from "react";
import {
  Box,
  Check,
  Copy,
  Hash,
  Link2,
  Sparkles,
  Trash2,
  User,
  RefreshCw,
} from "lucide-react";

import type { BlockchainBlock } from "@/types/blockchain";
import {
  BLOCKCHAIN_ACTION_LABELS,
  BLOCKCHAIN_ACTION_STYLES,
  DEFAULT_BLOCK_STYLE,
} from "@/types/blockchain";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/types/ecommerce";

interface BlockCardProps {
  block: BlockchainBlock;
  showOrderId?: boolean;
}

const ACTION_ICONS: Record<string, typeof Box> = {
  GENESIS: Sparkles,
  CREATED: Box,
  STATUS_CHANGED: RefreshCw,
  DELETED: Trash2,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatUser(block: BlockchainBlock) {
  if (block.performedByUser?.fullName) {
    return block.performedByUser.fullName;
  }
  if (block.performedBy === "SYSTEM") return "Sistema";
  return "Usuario desconocido";
}

function formatUserEmail(block: BlockchainBlock) {
  return block.performedByUser?.email ?? null;
}

function formatStatus(status: string) {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status;
}

function HashField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-lg bg-slate-900 p-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
          title="Copiar hash"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copiar
            </>
          )}
        </button>
      </div>
      <p className="font-mono text-[11px] leading-relaxed text-emerald-400 break-all">
        {value}
      </p>
    </div>
  );
}

export function BlockCard({ block, showOrderId = false }: BlockCardProps) {
  const actionLabel = BLOCKCHAIN_ACTION_LABELS[block.action] ?? block.action;
  const styles = BLOCKCHAIN_ACTION_STYLES[block.action] ?? DEFAULT_BLOCK_STYLE;
  const Icon = ACTION_ICONS[block.action] ?? Hash;

  return (
    <article
      className={`rounded-xl border-l-4 shadow-sm overflow-hidden ${styles.accent}`}
    >
      <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${styles.badge} border`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-900 text-white text-xs font-bold font-mono">
                #{block.blockIndex}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles.badge}`}
              >
                {block.action}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{actionLabel}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{formatDate(block.timestamp)}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Usuario</p>
              <p className="font-medium text-slate-800 truncate">{formatUser(block)}</p>
              {formatUserEmail(block) && (
                <p className="text-xs text-slate-500 truncate">{formatUserEmail(block)}</p>
              )}
            </div>
          </div>

          {showOrderId && block.orderId !== "GENESIS" && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
              <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">Orden</p>
                <p className="font-mono text-xs text-slate-800 truncate">{block.orderId}</p>
              </div>
            </div>
          )}

          {block.action === "STATUS_CHANGED" &&
            typeof block.data.previousStatus === "string" &&
            typeof block.data.newStatus === "string" && (
              <div className="sm:col-span-2 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                <RefreshCw className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-blue-400">Transición</p>
                  <p className="text-sm font-medium text-blue-900">
                    {formatStatus(String(block.data.previousStatus))}
                    <span className="mx-2 text-blue-400">→</span>
                    {formatStatus(String(block.data.newStatus))}
                  </p>
                </div>
              </div>
            )}

          {block.action === "CREATED" && typeof block.data.total === "number" && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
              <Box className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-emerald-500">Total orden</p>
                <p className="text-sm font-semibold text-emerald-900">
                  S/ {Number(block.data.total).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <HashField label="Hash del bloque" value={block.hash} />
          <HashField
            label="Hash anterior"
            value={block.previousHash === "GENESIS" ? "GENESIS" : block.previousHash}
          />
        </div>
      </div>
    </article>
  );
}
