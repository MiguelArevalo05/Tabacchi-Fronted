"use client";

interface ServiceAvailabilityFieldProps {
  value: boolean;
  onChange: (isAvailable: boolean) => void;
}

export function ServiceAvailabilityField({
  value,
  onChange,
}: ServiceAvailabilityFieldProps) {
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
              name="service-availability"
              checked={value}
              onChange={() => onChange(true)}
              className="text-emerald-600"
            />
            Disponible
          </span>
          <span className="text-xs text-slate-500 pl-6">
            El servicio se ofrece y puede agregarse al carrito.
          </span>
        </label>

        <label
          className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-colors ${
            !value
              ? "border-slate-300 bg-slate-50 ring-1 ring-slate-200"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <input
              type="radio"
              name="service-availability"
              checked={!value}
              onChange={() => onChange(false)}
              className="text-slate-600"
            />
            No disponible
          </span>
          <span className="text-xs text-slate-500 pl-6">
            Oculto en la tienda pública. Solo visible en el panel de administración.
          </span>
        </label>
      </div>
      <p className="text-xs text-slate-400">
        Los servicios no tienen stock ni cupos. Solo están disponibles o no.
      </p>
    </fieldset>
  );
}
