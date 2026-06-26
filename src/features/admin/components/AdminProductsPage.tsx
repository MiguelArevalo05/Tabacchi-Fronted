"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Edit, Package, Plus, Trash2 } from "lucide-react";

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
import { ProductAvailabilityField } from "@/features/admin/components/ProductAvailabilityField";
import { getUploadImageUrl } from "@/lib/utils";
import {
  createProduct,
  deleteProduct,
  getProductsAdmin,
  updateProduct,
  updateProductAvailability,
} from "@/features/products/services/productService";
import type { Product, ProductFormData } from "@/features/products/types/ecommerce";
import {
  formatPrice,
  getProductBadgeOption,
  PRODUCT_BADGE_OPTIONS,
} from "@/features/products/types/ecommerce";

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  originalPrice: null,
  discountPercentage: null,
  badgeLabel: "",
  badgeColor: null,
  stock: 0,
  isActive: true,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductsAdmin({ search, limit: 50 });
      setProducts(res.data);
    } catch {
      setToast({ type: "error", message: "Error al cargar productos." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const openEdit = (product: Product) => {
    const badge = getProductBadgeOption(product.badgeLabel, product.badgeColor);

    setForm({
      name: product.name,
      description: product.description ?? "",
      price: Number(product.price),
      originalPrice:
        product.originalPrice === null || product.originalPrice === undefined
          ? null
          : Number(product.originalPrice),
      discountPercentage: product.discountPercentage ?? null,
      badgeLabel: badge?.label ?? "",
      badgeColor: badge?.color ?? null,
      stock: product.stock,
      isActive: product.isActive,
    });
    setEditingId(product.id);
    resetImageState();
    setCurrentImageUrl(getUploadImageUrl(product.imageUrl));
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
        await updateProduct(editingId, form, imageFile);
        setToast({ type: "success", message: "Producto actualizado." });
      } else {
        await createProduct(form, imageFile!);
        setToast({ type: "success", message: "Producto creado." });
      }
      setShowModal(false);
      resetImageState();
      fetchProducts();
    } catch {
      setToast({ type: "error", message: "Error al guardar el producto." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    setTogglingId(product.id);
    try {
      const updated = await updateProductAvailability(product.id, !product.isActive);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, ...updated } : p))
      );
      setToast({
        type: "success",
        message: updated.isActive ? "Producto disponible." : "Producto oculto en tienda.",
      });
    } catch {
      setToast({ type: "error", message: "No se pudo cambiar la disponibilidad." });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteId(null);
      setToast({ type: "success", message: "Producto eliminado." });
      fetchProducts();
    } catch {
      setToast({ type: "error", message: "Error al eliminar." });
    }
  };

  const previewSrc = imagePreview || currentImageUrl;
  const selectedBadge = getProductBadgeOption(form.badgeLabel, form.badgeColor);

  const handleBadgeChange = (label: string) => {
    const option = PRODUCT_BADGE_OPTIONS.find((item) => item.label === label);
    setForm((prev) => ({
      ...prev,
      badgeLabel: option?.label ?? "",
      badgeColor: option?.color ?? null,
    }));
  };

  return (
    <div className="max-w-6xl">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AdminPageHeader
        icon={Package}
        title="Productos"
        description="Gestiona el catálogo de la tienda"
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        }
      />

      <AdminSearchBar
        value={search}
        onChange={setSearch}
        onSearch={fetchProducts}
        placeholder="Buscar productos..."
      />

      <AdminCard>
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTh>Imagen</AdminTh>
              <AdminTh>Nombre</AdminTh>
              <AdminTh>Precio</AdminTh>
              <AdminTh>Card</AdminTh>
              <AdminTh>Stock</AdminTh>
              <AdminTh>Estado</AdminTh>
              <AdminTh align="right">Acciones</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <AdminEmptyState message="Cargando productos..." colSpan={7} />
            ) : products.length === 0 ? (
              <AdminEmptyState message="No hay productos registrados" colSpan={7} />
            ) : (
              products.map((p) => {
                const img = getUploadImageUrl(p.imageUrl);
                const badge = getProductBadgeOption(p.badgeLabel, p.badgeColor);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      {img ? (
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                          <Image src={img} alt={p.name} fill className="object-cover" sizes="44px" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3.5 text-slate-700">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3.5 text-slate-700">
                      <div className="space-y-1 text-xs">
                        {badge ? (
                          <span className={`inline-flex rounded-full px-2 py-1 font-semibold ${badge.className}`}>
                            {badge.label}
                          </span>
                        ) : (
                          <span className="text-slate-400">Sin etiqueta</span>
                        )}
                        {p.originalPrice ? (
                          <p className="text-slate-500">Antes: {formatPrice(p.originalPrice)}</p>
                        ) : null}
                        {p.discountPercentage ? (
                          <p className="font-semibold text-blue-700">{p.discountPercentage}% OFF</p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{p.stock}</td>
                    <td className="px-4 py-3.5">
                      <AdminAvailabilityToggle
                        isActive={p.isActive}
                        loading={togglingId === p.id}
                        inactiveLabel="Agotado"
                        onToggle={() => handleToggleAvailability(p)}
                      />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button type="button" onClick={() => openEdit(p)} className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setDeleteId(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-1 transition-colors">
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
          title={editingId ? "Editar producto" : "Nuevo producto"}
          onClose={() => setShowModal(false)}
          size="xl"
          footer={
            <>
              <AdminBtnSecondary onClick={() => setShowModal(false)}>Cancelar</AdminBtnSecondary>
              <AdminBtnPrimary type="submit" form="product-form" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </AdminBtnPrimary>
            </>
          }
        >
          <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
            <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Información principal</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    placeholder="Ej. Extintor PQS 6 kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    value={String(form.stock ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    min={0}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    value={form.description ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="min-h-24 w-full resize-y px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    placeholder="Texto corto que aparecerá en la card del producto"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">Precio y etiqueta de card</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio actual</label>
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

                <div>
                  <label className="block text-sm font-medium mb-1">Precio anterior</label>
                  <input
                    type="number"
                    value={String(form.originalPrice ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        originalPrice: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    min={0}
                    step="0.01"
                    placeholder="Opcional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descuento (%)</label>
                  <input
                    type="number"
                    value={String(form.discountPercentage ?? "")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountPercentage: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    min={0}
                    max={100}
                    placeholder="Opcional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Etiqueta del producto</label>
                  <select
                    value={form.badgeLabel ?? ""}
                    onChange={(e) => handleBadgeChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  >
                    <option value="">Sin etiqueta</option>
                    {PRODUCT_BADGE_OPTIONS.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    La etiqueta se mostrará arriba de la imagen en la landing.
                  </p>
                </div>

                <div>
                  <span className="block text-sm font-medium mb-1">Vista previa</span>
                  <div className="flex h-11 items-center rounded-xl border border-dashed border-slate-200 px-3">
                    {selectedBadge ? (
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selectedBadge.className}`}>
                        {selectedBadge.label}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Sin etiqueta visible</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
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
                  <div className="relative mt-4 h-36 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image src={previewSrc} alt="Vista previa" fill className="object-contain p-3" sizes="280px" unoptimized={!!imagePreview} />
                  </div>
                )}
              </div>

              <ProductAvailabilityField
                value={form.isActive ?? true}
                onChange={(isActive) => setForm((p) => ({ ...p, isActive }))}
              />
            </section>
          </form>
        </AdminModal>
      )}

      {deleteId && (
        <AdminModal
          title="Eliminar producto"
          onClose={() => setDeleteId(null)}
          size="sm"
          footer={
            <>
              <AdminBtnSecondary onClick={() => setDeleteId(null)}>Cancelar</AdminBtnSecondary>
              <AdminBtnDanger onClick={() => handleDelete(deleteId)}>Eliminar</AdminBtnDanger>
            </>
          }
        >
          <p className="text-slate-600 text-sm">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
        </AdminModal>
      )}
    </div>
  );
}
