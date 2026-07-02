"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";

import { CheckoutField, RequiredMark } from "@/features/checkout/components/checkoutUi";

interface PaymentProofUploadProps {
  preview: string | null;
  onChange: (file: File | null, preview: string | null) => void;
  error?: string | null;
  accentColor?: string;
}

export default function PaymentProofUpload({
  preview,
  onChange,
  error,
  accentColor = "#17245c",
}: PaymentProofUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      onChange(null, null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      onChange(null, null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange(file, previewUrl);
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    onChange(null, null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{ backgroundColor: accentColor }}
        >
          2
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] font-bold text-[#17245c]">
            Sube tu comprobante <RequiredMark />
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#8b93a1]">
            Adjunta una captura clara donde se vea el monto, la fecha y el destinatario.
          </p>
        </div>
      </div>

      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#e3e7ee] bg-white shadow-sm">
          <div className="relative aspect-[4/3] w-full max-w-lg">
            <Image
              src={preview}
              alt="Vista previa del comprobante"
              fill
              unoptimized
              className="object-contain p-4"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#17245c] shadow-md ring-1 ring-[#e3e7ee] transition hover:bg-white"
            aria-label="Quitar comprobante"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="paymentProof"
          className="group flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7dce5] bg-white px-6 py-8 text-center shadow-sm transition hover:border-[#17245c]/35 hover:bg-[#fafbfc]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f5f9] text-[#17245c] transition group-hover:scale-105 group-hover:bg-[#eef2f7]">
            <ImagePlus className="h-6 w-6" />
          </span>
          <span className="mt-4 flex items-center gap-2 text-[15px] font-semibold text-[#17245c]">
            <Upload className="h-4 w-4" />
            Seleccionar imagen
          </span>
          <span className="mt-1.5 text-[13px] text-[#8b93a1]">
            JPG, PNG o WEBP — máximo 5 MB
          </span>
        </label>
      )}

      <input
        id="paymentProof"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
      />

      {error ? (
        <p className="text-sm font-medium text-[#d71920]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
