"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Edit, FolderOpen, Plus, Trash2 } from "lucide-react";

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
import { getUploadImageUrl } from "@/lib/utils";
import {
  createCategory,
  deleteCategory,
  getCategoriesAdmin,
  updateCategory,
  updateCategoryAvailability,
} from "@/features/categories/services/categoryService";
import type { Category, CategoryFormData } from "@/features/categories/types/category";

const emptyForm: CategoryFormData = {
  name: "",
  description: "",
  displayOrder: 0,
  isActive: true,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchCategories = useCallback(async (currentSearch: string) => {
    try {
      setLoading(true);
      const res = await getCategoriesAdmin({ search: currentSearch, limit: 50 });
      setCategories(res.data);
    } catch {
      setToast({ type: "error", message: "Error al cargar categorías." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(search);
  }, [search, fetchCategories]);

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

  const openEdit = (category: Category) => {
    setForm({
      name: category.name,
      description: category.description ?? "",
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setEditingId(category.id);
    resetImageState();
    setCurrentImageUrl(getUploadImageUrl(category.imageUrl));
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

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateCategory(editingId, form, imageFile);
        setCategories((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item))
        );
        setToast({ type: "success", message: "Categoría actualizada." });
      } else {
        await createCategory(form, imageFile);
        setToast({ type: "success", message: "Categoría creada." });
      }

      setShowModal(false);
      resetImageState();
      fetchCategories(search);
    } catch {
      setToast({ type: "error", message: "Error al guardar la categoría." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (category: Category) => {
    setTogglingId(category.id);
    try {
      const updated = await updateCategoryAvailability(category.id, !category.isActive);
      setCategories((prev) =>
        prev.map((item) => (item.id === category.id ? { ...item, ...updated } : item))
      );
      setToast({
        type: "success",
        message: updated.isActive ? "Categoría visible en tienda." : "Categoría oculta en tienda.",
      });
    } catch {
      setToast({ type: "error", message: "No se pudo cambiar la disponibilidad." });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setDeleteId(null);
      setToast({ type: "success", message: "Categoría eliminada." });
      fetchCategories(search);
    } catch {
      setToast({ type: "error", message: "Error al eliminar." });
    }
  };

  const previewSrc = imagePreview || currentImageUrl;

  return (
    <div className="max-w-6xl">
      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

      <AdminPageHeader
        icon={FolderOpen}
        title="Categorías"
        description="Organiza el catálogo por categorías de productos"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" /> Nueva categoría
          </button>
        }
      />

      <AdminSearchBar
        value={search}
        onChange={setSearch}
        onSearch={() => fetchCategories(search)}
        placeholder="Buscar categorías..."
      />

      <AdminCard>
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTh>Imagen</AdminTh>
              <AdminTh>Nombre</AdminTh>
              <AdminTh>Slug</AdminTh>
              <AdminTh>Orden</AdminTh>
              <AdminTh>Estado</AdminTh>
              <AdminTh align="right">Acciones</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <AdminEmptyState message="Cargando categorías..." colSpan={6} />
            ) : categories.length === 0 ? (
              <AdminEmptyState message="No hay categorías registradas" colSpan={6} />
            ) : (
              categories.map((category) => {
                const img = getUploadImageUrl(category.imageUrl);
                return (
                  <tr key={category.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-4 py-3.5">
                      {img ? (
                        <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                          <Image src={img} alt={category.name} fill className="object-cover" sizes="44px" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-900">{category.name}</p>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {category.description}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{category.slug}</td>
                    <td className="px-4 py-3.5 text-slate-700">{category.displayOrder}</td>
                    <td className="px-4 py-3.5">
                      <AdminAvailabilityToggle
                        isActive={category.isActive}
                        loading={togglingId === category.id}
                        onToggle={() => handleToggleAvailability(category)}
                      />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        className="rounded-lg p-2 text-blue-700 transition-colors hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(category.id)}
                        className="ml-1 rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </AdminTable>
      </AdminCard>

      {showModal ? (
        <AdminModal
          key={editingId ?? "new"}
          title={editingId ? "Editar categoría" : "Nueva categoría"}
          onClose={() => setShowModal(false)}
          size="lg"
          footer={
            <>
              <AdminBtnSecondary onClick={() => setShowModal(false)}>Cancelar</AdminBtnSecondary>
              <AdminBtnPrimary type="submit" form="category-form" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </AdminBtnPrimary>
            </>
          }
        >
          <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Orden</label>
                <input
                  type="number"
                  value={String(form.displayOrder ?? "")}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      displayOrder: e.target.value === "" ? 0 : Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  min={0}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Descripción</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-24 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Imagen (opcional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
                />
                {previewSrc ? (
                  <div className="relative mt-4 h-36 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={previewSrc}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                      sizes="280px"
                      unoptimized={!!imagePreview}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {deleteId ? (
        <AdminModal
          title="Eliminar categoría"
          onClose={() => setDeleteId(null)}
          footer={
            <>
              <AdminBtnSecondary onClick={() => setDeleteId(null)}>Cancelar</AdminBtnSecondary>
              <AdminBtnDanger onClick={() => handleDelete(deleteId)}>Eliminar</AdminBtnDanger>
            </>
          }
        >
          <p className="text-sm text-slate-600">
            ¿Seguro que deseas eliminar esta categoría? Los productos asociados quedarán sin categoría.
          </p>
        </AdminModal>
      ) : null}
    </div>
  );
}
