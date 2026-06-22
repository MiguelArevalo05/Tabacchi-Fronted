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
          footer={
            <>
              <AdminBtnSecondary onClick={() => setShowModal(false)}>Cancelar</AdminBtnSecondary>
              <AdminBtnPrimary type="submit" form="service-form" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </AdminBtnPrimary>
            </>
          }
        >
          <form id="service-form" onSubmit={handleSubmit} className="space-y-4">

            {[
              { key: "name", label: "Nombre", type: "text" },
              { key: "description", label: "Descripción", type: "text" },
              { key: "price", label: "Precio (S/)", type: "number" },
              { key: "displayOrder", label: "Orden de visualización", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={String(form[f.key as keyof ServiceFormData] ?? "")}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  required={f.key === "name"}
                  step={f.key === "price" ? "0.01" : undefined}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">
                Imagen {editingId ? "(opcional)" : "(obligatoria)"}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-600"
              />
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP o GIF. Máx. 5 MB.</p>
              {previewSrc && (
                <div className="relative w-24 h-24 mt-3 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={previewSrc} alt="Vista previa" fill className="object-cover" sizes="96px" unoptimized={!!imagePreview} />
                </div>
              )}
            </div>

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