"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

import { verifyOrderBlockchain } from "@/features/admin/blockchain/services/blockchainService";
import {
  ORDER_DIFFERENCE_LABELS,
  type OrderVerificationResult,
} from "@/features/admin/blockchain/types/blockchain";
import { formatPrice } from "@/features/products/types/ecommerce";

interface OrderIntegrityCheckProps {
  orderId: string;
}

export function OrderIntegrityCheck({ orderId }: OrderIntegrityCheckProps) {
  const [result, setResult] = useState<OrderVerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await verifyOrderBlockchain(orderId);
      setResult(data);
    } catch {
      setError("No se pudo verificar la integridad de la orden.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Verificando datos de la orden contra blockchain…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!result) return null;

  if (!result.hasCreatedBlock) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Esta orden no tiene un bloque CREATED en la blockchain.
      </div>
    );
  }

  const chainBroken = !result.chainValid;
  const orderAltered = result.orderTampered;
  const isSafe = !chainBroken && !orderAltered;

  return (
    <div
      className={`rounded-xl border-2 px-4 py-4 ${
        isSafe
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-300 bg-red-50"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {isSafe ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-semibold ${isSafe ? "text-emerald-900" : "text-red-900"}`}>
              {isSafe
                ? "Datos de la orden íntegros"
                : "¡Alerta! Posible manipulación detectada"}
            </p>
            <p className={`text-sm mt-0.5 ${isSafe ? "text-emerald-700" : "text-red-700"}`}>
              {isSafe
                ? "El registro actual coincide con el bloque CREATED de la blockchain."
                : "Los datos actuales no coinciden con lo registrado al crear la orden."}
            </p>

            {chainBroken && (
              <p className="text-xs text-red-700 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                La cadena de bloques también está comprometida.
              </p>
            )}

            {orderAltered && result.differences.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.differences.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 border border-red-200 text-xs font-semibold text-red-800"
                  >
                    {ORDER_DIFFERENCE_LABELS[field] ?? field} alterado
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={runCheck}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Re-verificar
        </button>
      </div>

      {orderAltered && result.snapshot && result.current && (
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/80 border border-emerald-100 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 mb-2">
              Registro blockchain (CREATED)
            </p>
            <p className="text-lg font-bold text-slate-900">
              {formatPrice(result.snapshot.total)}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {result.snapshot.items.map((item) => (
                <li key={`${item.itemType}-${item.productId ?? item.serviceId}`}>
                  {item.productName} × {item.quantity} — {formatPrice(item.subtotal)}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-white/80 border border-red-200 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600 mb-2">
              Registro actual en sistema
            </p>
            <p className="text-lg font-bold text-red-700">
              {formatPrice(result.current.total)}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {result.current.items.map((item) => (
                <li key={`${item.itemType}-${item.productId ?? item.serviceId}`}>
                  {item.productName} × {item.quantity} — {formatPrice(item.subtotal)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
