"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, ShieldX, ShieldAlert } from "lucide-react";

import { validateBlockchain } from "@/features/admin/blockchain/services/blockchainService";

interface BlockchainValidationProps {
  autoFetch?: boolean;
  compact?: boolean;
}

export function BlockchainValidation({
  autoFetch = true,
  compact = false,
}: BlockchainValidationProps) {
  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runValidation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await validateBlockchain();
      setValid(result.valid);
      setLastChecked(new Date());
    } catch {
      setError("No se pudo verificar la integridad.");
      setValid(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      runValidation();
    }
  }, [autoFetch, runValidation]);

  const statusConfig =
    valid === true
      ? {
          border: "border-emerald-300",
          bg: "bg-gradient-to-r from-emerald-50 to-teal-50",
          icon: ShieldCheck,
          iconColor: "text-emerald-600",
          title: "Blockchain válida",
          subtitle: "Todas las cadenas por orden están íntegras.",
          indicator: "🟢",
        }
      : valid === false
        ? {
            border: "border-red-300",
            bg: "bg-gradient-to-r from-red-50 to-orange-50",
            icon: ShieldX,
            iconColor: "text-red-600",
            title: "Blockchain comprometida",
            subtitle: "Se detectaron inconsistencias en alguna cadena de orden.",
            indicator: "🔴",
          }
        : {
            border: "border-slate-200",
            bg: "bg-slate-50",
            icon: ShieldAlert,
            iconColor: "text-slate-500",
            title: loading ? "Verificando…" : error ? "Error de verificación" : "Sin verificar",
            subtitle: error ?? "Presiona el botón para comprobar la integridad.",
            indicator: "⚪",
          };

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`rounded-2xl border-2 shadow-sm ${statusConfig.border} ${statusConfig.bg} ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 rounded-xl bg-white p-3 shadow-sm border border-white/80 ${compact ? "p-2.5" : "p-3.5"}`}
          >
            <StatusIcon
              className={`${compact ? "w-6 h-6" : "w-8 h-8"} ${statusConfig.iconColor} ${
                loading ? "animate-pulse" : ""
              }`}
            />
          </div>
          <div>
            <p className={`font-bold text-slate-900 ${compact ? "text-sm" : "text-lg"}`}>
              {statusConfig.indicator} {statusConfig.title}
            </p>
            <p className={`text-slate-600 mt-0.5 ${compact ? "text-xs" : "text-sm"}`}>
              {statusConfig.subtitle}
            </p>
            {lastChecked && !error && (
              <p className="text-[11px] text-slate-400 mt-1.5">
                Última verificación:{" "}
                {lastChecked.toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={runValidation}
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 shrink-0 font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-md ${
            compact ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Verificar Integridad
        </button>
      </div>
    </div>
  );
}
