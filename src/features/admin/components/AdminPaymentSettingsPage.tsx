"use client";

import { useEffect, useId, useState } from "react";
import { Eye, Smartphone, UserRound, Wallet } from "lucide-react";

import { Toast } from "@/components/ui/toast";
import { PaymentBrandImage } from "@/features/checkout/components/CheckoutPaymentLogos";
import {
  PAYMENT_BRAND_THEMES,
  type PaymentBrand,
} from "@/features/checkout/constants/payment-brands";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminCard } from "@/features/admin/components/AdminCard";
import { AdminBtnPrimary } from "@/features/admin/components/AdminModal";
import {
  getPaymentSettings,
  updatePaymentSettings,
  type UpdatePaymentConfigRequest,
} from "@/features/admin/services/paymentSettingsService";

const emptyForm: UpdatePaymentConfigRequest = {
  yapePhone: "",
  yapeHolderName: "",
  plinPhone: "",
  plinHolderName: "",
};

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15";

interface PaymentMethodSettingsCardProps {
  brand: PaymentBrand;
  title: string;
  description: string;
  phone: string;
  holderName: string;
  onPhoneChange: (value: string) => void;
  onHolderChange: (value: string) => void;
}

function PaymentMethodSettingsCard({
  brand,
  title,
  description,
  phone,
  holderName,
  onPhoneChange,
  onHolderChange,
}: PaymentMethodSettingsCardProps) {
  const phoneId = useId();
  const holderId = useId();
  const theme = PAYMENT_BRAND_THEMES[brand];

  return (
    <AdminCard>
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: theme.accent }}
        aria-hidden
      />

      <div className="space-y-6 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <PaymentBrandImage brand={brand} size="lg" />
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
          </div>
        </div>

        <div
          className="rounded-2xl border p-4 sm:p-5"
          style={{
            borderColor: theme.surfaceBorder,
            backgroundColor: theme.surface,
          }}
        >
          <div className="space-y-4">
            <label className="block" htmlFor={phoneId}>
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Smartphone className="h-4 w-4 text-slate-400" />
                Número de celular
              </span>
              <input
                id={phoneId}
                type="tel"
                required
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                placeholder="987 654 321"
                className={inputClassName}
              />
            </label>

            <label className="block" htmlFor={holderId}>
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UserRound className="h-4 w-4 text-slate-400" />
                Nombre del titular
              </span>
              <input
                id={holderId}
                type="text"
                required
                value={holderName}
                onChange={(event) => onHolderChange(event.target.value)}
                placeholder="Grupo Tabacchi"
                className={inputClassName}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Eye className="h-3.5 w-3.5" />
            Vista previa en checkout
          </p>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-900">{phone || "Sin número configurado"}</p>
            <p className="text-slate-600">{holderName || "Sin titular configurado"}</p>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}

export default function AdminPaymentSettingsPage() {
  const [form, setForm] = useState<UpdatePaymentConfigRequest>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const config = await getPaymentSettings();
      setForm({
        yapePhone: config.yape.phone,
        yapeHolderName: config.yape.holderName,
        plinPhone: config.plin.phone,
        plinHolderName: config.plin.holderName,
      });
    } catch {
      setToast({
        type: "error",
        message: "No se pudieron cargar los datos de pago.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const updated = await updatePaymentSettings({
        yapePhone: form.yapePhone.trim(),
        yapeHolderName: form.yapeHolderName.trim(),
        plinPhone: form.plinPhone.trim(),
        plinHolderName: form.plinHolderName.trim(),
      });

      setForm({
        yapePhone: updated.yape.phone,
        yapeHolderName: updated.yape.holderName,
        plinPhone: updated.plin.phone,
        plinHolderName: updated.plin.holderName,
      });
      setToast({
        type: "success",
        message: "Datos de Yape y Plin actualizados correctamente.",
      });
    } catch {
      setToast({
        type: "error",
        message: "No se pudieron guardar los cambios. Revisa los campos.",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (
    key: keyof UpdatePaymentConfigRequest,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {toast ? (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}

      <AdminPageHeader
        icon={Wallet}
        title="Pagos Yape / Plin"
        description="Configura el número y titular que verán los clientes al pagar en el checkout."
        actions={
          !loading ? (
            <AdminBtnPrimary type="submit" form="admin-payment-settings-form" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </AdminBtnPrimary>
          ) : null
        }
      />

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((item) => (
            <AdminCard key={item}>
              <div className="animate-pulse space-y-4 p-6">
                <div className="h-12 w-12 rounded-xl bg-slate-100" />
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-11 rounded-xl bg-slate-100" />
                <div className="h-11 rounded-xl bg-slate-100" />
              </div>
            </AdminCard>
          ))}
        </div>
      ) : (
        <form id="admin-payment-settings-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <PaymentMethodSettingsCard
              brand="yape"
              title="Yape"
              description="Datos que aparecen cuando el cliente elige pagar con Yape."
              phone={form.yapePhone}
              holderName={form.yapeHolderName}
              onPhoneChange={(value) => updateField("yapePhone", value)}
              onHolderChange={(value) => updateField("yapeHolderName", value)}
            />

            <PaymentMethodSettingsCard
              brand="plin"
              title="Plin"
              description="Datos que aparecen cuando el cliente elige pagar con Plin."
              phone={form.plinPhone}
              holderName={form.plinHolderName}
              onPhoneChange={(value) => updateField("plinPhone", value)}
              onHolderChange={(value) => updateField("plinHolderName", value)}
            />
          </div>

          <AdminCard>
            <div className="p-5 sm:p-6">
              <p className="text-sm font-semibold text-slate-900">
                Los cambios se aplican de inmediato en el checkout
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Verifica que el número y el titular coincidan con tu cuenta real de Yape o Plin.
              </p>
            </div>
          </AdminCard>
        </form>
      )}
    </div>
  );
}
