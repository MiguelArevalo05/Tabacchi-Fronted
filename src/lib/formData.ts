import type { ProductFormData, ServiceFormData } from "@/features/products/types/ecommerce";

const WEBP_MIME_TYPE = "image/webp";
const WEBP_QUALITY = 0.9;

function appendField(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  if (typeof value === "boolean") {
    formData.append(key, String(value));
    return;
  }
  formData.append(key, String(value));
}

function appendNullableField(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) {
    formData.append(key, "");
    return;
  }
  formData.append(key, String(value));
}

function toWebpFileName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  return `${nameWithoutExtension || "image"}.webp`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo procesar la imagen."));
    image.src = src;
  });
}

function canvasToWebpBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo convertir la imagen a WEBP."));
          return;
        }
        resolve(blob);
      },
      WEBP_MIME_TYPE,
      WEBP_QUALITY
    );
  });
}

async function convertImageToWebp(image: File): Promise<File> {
  if (image.type === WEBP_MIME_TYPE) {
    return image.name.toLowerCase().endsWith(".webp")
      ? image
      : new File([image], toWebpFileName(image.name), {
          type: WEBP_MIME_TYPE,
          lastModified: image.lastModified,
        });
  }

  const imageUrl = URL.createObjectURL(image);

  try {
    const loadedImage = await loadImage(imageUrl);
    const canvas = document.createElement("canvas");
    canvas.width = loadedImage.naturalWidth;
    canvas.height = loadedImage.naturalHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("No se pudo preparar la imagen para subirla.");
    }

    context.drawImage(loadedImage, 0, 0);
    const webpBlob = await canvasToWebpBlob(canvas);

    return new File([webpBlob], toWebpFileName(image.name), {
      type: WEBP_MIME_TYPE,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function buildProductFormData(
  data: Partial<ProductFormData>,
  image?: File | null
): Promise<FormData> {
  const formData = new FormData();
  appendField(formData, "name", data.name);
  appendField(formData, "description", data.description);
  appendField(formData, "price", data.price);
  appendNullableField(formData, "originalPrice", data.originalPrice);
  appendNullableField(formData, "discountPercentage", data.discountPercentage);
  appendNullableField(formData, "badgeLabel", data.badgeLabel);
  appendNullableField(formData, "badgeColor", data.badgeColor);
  appendField(formData, "stock", data.stock);
  appendField(formData, "isActive", data.isActive);
  if (image) formData.append("image", await convertImageToWebp(image));
  return formData;
}

export async function buildServiceFormData(
  data: Partial<ServiceFormData>,
  image?: File | null
): Promise<FormData> {
  const formData = new FormData();
  appendField(formData, "name", data.name);
  appendField(formData, "description", data.description);
  appendField(formData, "price", data.price);
  appendField(formData, "displayOrder", data.displayOrder);
  appendField(formData, "isActive", data.isActive);
  if (image) formData.append("image", await convertImageToWebp(image));
  return formData;
}
