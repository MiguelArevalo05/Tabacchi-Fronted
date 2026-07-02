"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import {
  DocumentType,
  type UpdateAccountProfileRequest,
} from "@/features/account/types/account";
import { updateAccountProfile } from "@/features/account/services/accountService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { splitFullName, joinFullName } from "@/features/checkout/utils/name";

const DOCUMENT_TYPE_OPTIONS = [
  { value: DocumentType.DNI, label: "DNI" },
  { value: DocumentType.RUC, label: "RUC" },
  { value: DocumentType.CE, label: "Carné de extranjería" },
  { value: DocumentType.PASSPORT, label: "Pasaporte" },
];

export default function AccountProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    shippingAddress: "",
    documentType: DocumentType.DNI,
    documentNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    if (!user) return;

    const { firstName, lastName } = splitFullName(user.fullName);

    setForm({
      firstName,
      lastName,
      phone: user.phone || "",
      shippingAddress: user.shippingAddress || "",
      documentType: user.documentType ?? DocumentType.DNI,
      documentNumber: user.documentNumber || "",
    });
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const payload: UpdateAccountProfileRequest = {
      fullName: joinFullName(form.firstName, form.lastName),
      phone: form.phone.trim(),
      shippingAddress: form.shippingAddress.trim(),
      documentType: form.documentType,
      documentNumber: form.documentNumber.trim(),
    };

    try {
      await updateAccountProfile(payload);
      await refreshUser();
      setToast({ type: "success", message: "Tus datos se actualizaron correctamente." });
    } catch {
      setToast({ type: "error", message: "No se pudieron guardar tus datos." });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {toast ? (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-semibold text-slate-700">
              Nombres
            </label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#17245c] focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-semibold text-slate-700">
              Apellidos
            </label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#17245c] focus:ring-2"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="documentType" className="mb-1 block text-sm font-semibold text-slate-700">
              Tipo de documento
            </label>
            <select
              id="documentType"
              value={form.documentType}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  documentType: event.target.value as DocumentType,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#17245c] focus:ring-2"
            >
              {DOCUMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="documentNumber"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              Número de documento
            </label>
            <input
              id="documentNumber"
              type="text"
              value={form.documentNumber}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, documentNumber: event.target.value }))
              }
              minLength={6}
              maxLength={20}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#17245c] focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-slate-700">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="+51 999 999 999"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#17245c] focus:ring-2"
          />
        </div>

        <div>
          <label
            htmlFor="shippingAddress"
            className="mb-1 block text-sm font-semibold text-slate-700"
          >
            Dirección predeterminada
          </label>
          <textarea
            id="shippingAddress"
            value={form.shippingAddress}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, shippingAddress: event.target.value }))
            }
            rows={3}
            placeholder="Av. Ejemplo 123, Lima"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#17245c] focus:ring-2"
          />
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="bg-[#17245c] px-8 font-bold hover:bg-[#111a45]"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </>
  );
}
