"use client";

interface ProductAvailabilityFieldProps {
  value: boolean;
  onChange: (isAvailable: boolean) => void;
}

export function ProductAvailabilityField({
  value,
  onChange,
}: ProductAvailabilityFieldProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium mb-2">Estado</legend>
      <div className="grid sm:grid-cols-2 gap-3">
        <label
          className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-colors ${
            value
              ? "border-emerald-300 bg-emerald-50/60 ring-1 ring-emerald-200"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <input
              type="radio"
              name="product-availability"
              checked={value}
              onChange={() => onChange(true)}
              className="text-emerald-600"
            />
            Disponible
          </span>
          <span className="text-xs text-slate-500 pl-6">
            Visible en la tienda pública y habilitado para venta.
          </span>
        </label>

        <label
          className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-colors ${
            !value
              ? "border-amber-300 bg-amber-50/60 ring-1 ring-amber-200"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <input
              type="radio"
              name="product-availability"
              checked={!value}
              onChange={() => onChange(false)}
              className="text-amber-600"
            />
            Agotado
          </span>
          <span className="text-xs text-slate-500 pl-6">
            Oculto en la tienda pública. Solo visible en el panel de administración.
          </span>
        </label>
      </div>
      <p className="text-xs text-slate-400">
        El stock no cambia este estado. Se refleja igual en la tabla del panel y en la landing.
      </p>
    </fieldset>
  );
}
