"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Edit, Plus, Trash2, Wrench } from "lucide-react";

import { Toast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
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
  AdminBtnPrimary,
  AdminBtnSecondary,
  AdminModal,
} from "@/features/admin/components/AdminModal";
import { AdminAvailabilityToggle } from "@/features/admin/components/AdminAvailabilityToggle";
import { ServiceAvailabilityField } from "@/features/admin/components/ServiceAvailabilityField";
import { getUploadImageUrl } from "@/lib/utils";
import {
  createService,
  deleteService,
  getServicesAdmin,
  updateService,
  updateServiceAvailability,
} from "@/features/products/services/serviceOfferingService";
import type { ServiceFormData, ServiceOffering } from "@/features/products/types/ecommerce";
import { formatPrice } from "@/features/products/types/ecommerce";

const emptyForm: ServiceFormData = {
  name: "",
  description: "",
  price: 0,
  displayOrder: 0,
  isActive: true,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function CatalogServicesPage() {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchServices = useCallback(async (currentSearch: string) => {
    try {
      setLoading(true);
      const res = await getServicesAdmin({ search: currentSearch, limit: 50 });
      setServices(res.data);
    } catch {
      setToast({ type: "error", message: "Error al cargar servicios." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices(search);
  }, [search, fetchServices]);

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview(null);
    setCurrentImageUrl(null);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    resetImageState();
    setShowModal(true);
  };

  const openEdit = (service: ServiceOffering) => {
    setForm({
      name: service.name,
      description: service.description ?? "",
      price: Number(service.price),
      displayOrder: service.displayOrder,
      isActive: service.isActive,
    });
    setEditingId(service.id);
    resetImageState();
    setCurrentImageUrl(getUploadImageUrl(service.imageUrl));
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setToast({ type: "error", message: "Solo JPG, PNG, WEBP o GIF." });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setToast({ type: "error", message: "La imagen no puede superar 5 MB." });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setToast({ type: "error", message: "El nombre es obligatorio." });
      return;
    }
    if (!editingId && !imageFile) {
      setToast({ type: "error", message: "Debes subir una imagen." });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateService(editingId, form, imageFile);
        setServices((prev) =>
          prev.map((s) =>
            s.id === editingId ? { ...s, ...updated } : s
          )
        );

        setToast({ type: "success", message: "Servicio actualizado." });
      } else {
        await createService(form, imageFile!);
        setToast({ type: "success", message: "Servicio creado." });
      }

      setShowModal(false);
      resetImageState();
      fetchServices(search);
    } catch {
      setToast({ type: "error", message: "Error al guardar el servicio." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (service: ServiceOffering) => {
    setTogglingId(service.id);
    try {
      const updated = await updateServiceAvailability(service.id, !service.isActive);
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, ...updated } : s))
      );
      setToast({
        type: "success",
        message: updated.isActive ? "Servicio disponible." : "Servicio oculto en tienda.",
      });
    } catch {
      setToast({ type: "error", message: "No se pudo cambiar la disponibilidad." });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      setDeleteId(null);
      setToast({ type: "success", message: "Servicio eliminado." });
      fetchServices(search);
    } catch {
      setToast({ type: "error", message: "Error al eliminar." });
    }
  };

  const previewSrc = imagePreview || currentImageUrl;

  return (
    <div className="max-w-6xl">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        icon={Wrench}
        title="Servicios"
        description="Nombre, descripción, precio, imagen y disponibilidad"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nuevo servicio
          </button>
        }
      />

      <AdminSearchBar
        value={search}
        onChange={setSearch}
        onSearch={() => fetchServices(search)}
        placeholder="Buscar servicios..."
      />

      <AdminCard>
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTh>Imagen</AdminTh>
              <AdminTh>Nombre</AdminTh>
              <AdminTh>Precio</AdminTh>
              <AdminTh>Orden</AdminTh>
              <AdminTh>Estado</AdminTh>
              <AdminTh align="right">Acciones</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <AdminEmptyState message="Cargando servicios..." colSpan={6} />
            ) : services.length === 0 ? (
              <AdminEmptyState message="No hay servicios registrados" colSpan={6} />
            ) : (
              services.map((s) => {
                const img = getUploadImageUrl(s.imageUrl);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      {img ? (
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                          <Image src={img} alt={s.name} fill className="object-cover" sizes="44px" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-slate-500 text-xs truncate max-w-xs mt-0.5">{s.description}</p>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900">{formatPrice(s.price)}</td>
                    <td className="px-4 py-3.5 text-slate-700">{s.displayOrder}</td>
                    <td className="px-4 py-3.5">
                      <AdminAvailabilityToggle
                        isActive={s.isActive}
                        loading={togglingId === s.id}
                        onToggle={() => handleToggleAvailability(s)}
                      />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button type="button" onClick={() => openEdit(s)} className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setDeleteId(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-1 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </AdminTable>
      </AdminCard>

      {showModal && (
        <AdminModal
          key={editingId ?? "new"}
          title={editingId ? "Editar servicio" : "Nuevo servicio"}
          onClose={() => setShowModal(false)}
          size="xl"
          footer={
            <>
              <AdminBtnSecondary onClick={() => setShowModal(false)}>Cancelar</AdminBtnSecondary>
              <AdminBtnPrimary type="submit" form="service-form" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </AdminBtnPrimary>
            </>
          }
        >
          <form id="service-form" onSubmit={handleSubmit} className="space-y-5">
            <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Información del servicio</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    placeholder="Ej. Mantenimiento de extintores"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Orden de visualización</label>
                  <input
                    type="number"
                    value={String(form.displayOrder ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        displayOrder: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    min={0}
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Los números menores aparecen primero.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Descripción para la landing</label>
                  <textarea
                    value={form.description ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="min-h-36 w-full resize-y px-3 py-2.5 border border-slate-200 rounded-xl text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    placeholder="Escribe un mini párrafo: qué incluye el servicio, para quién está pensado y qué beneficio ofrece."
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Este texto se mostrará como mini párrafo en la card pública del servicio.
                  </p>
                </div>
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Precio comercial</h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    value={String(form.price ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        price: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    min={0}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <label className="block text-sm font-semibold text-slate-900">
                  Imagen {editingId ? "(opcional, deja vacío para mantener la actual)" : "(obligatoria)"}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
                />
                <p className="text-xs text-slate-400 mt-2">
                  JPG, PNG, WEBP o GIF. Máx. 5 MB. Se subirá en formato WEBP.
                </p>
                {previewSrc && (
                  <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image src={previewSrc} alt="Vista previa" fill className="object-cover" sizes="360px" unoptimized={!!imagePreview} />
                  </div>
                )}
              </div>
            </section>

            <ServiceAvailabilityField
              value={form.isActive ?? true}
              onChange={(isActive) => setForm((p) => ({ ...p, isActive }))}
            />
          </form>
        </AdminModal>
      )}

      {deleteId && (
        <AdminModal
          title="Eliminar servicio"
          onClose={() => setDeleteId(null)}
          size="sm"
          footer={
            <>
              <AdminBtnSecondary onClick={() => setDeleteId(null)}>Cancelar</AdminBtnSecondary>
              <AdminBtnDanger onClick={() => handleDelete(deleteId)}>Eliminar</AdminBtnDanger>
            </>
          }
        >
          <p className="text-slate-600 text-sm">¿Estás seguro de que deseas eliminar este servicio?</p>
        </AdminModal>
      )}
    </div>
  );
}