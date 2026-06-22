import type { ProductFormData, ServiceFormData } from "@/types/ecommerce";

function appendField(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  if (typeof value === "boolean") {
    formData.append(key, String(value));
    return;
  }
  formData.append(key, String(value));
}

export function buildProductFormData(
  data: Partial<ProductFormData>,
  image?: File | null
): FormData {
  const formData = new FormData();
  appendField(formData, "name", data.name);
  appendField(formData, "description", data.description);
  appendField(formData, "price", data.price);
  appendField(formData, "stock", data.stock);
  appendField(formData, "isActive", data.isActive);
  if (image) formData.append("image", image);
  return formData;
}

export function buildServiceFormData(
  data: Partial<ServiceFormData>,
  image?: File | null
): FormData {
  const formData = new FormData();
  appendField(formData, "name", data.name);
  appendField(formData, "description", data.description);
  appendField(formData, "price", data.price);
  appendField(formData, "displayOrder", data.displayOrder);
  appendField(formData, "isActive", data.isActive);
  if (image) formData.append("image", image);
  return formData;
}
