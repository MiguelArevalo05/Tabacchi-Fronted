"use client";

interface AdminAvailabilityToggleProps {
  isActive: boolean;
  loading?: boolean;
  onToggle: (isActive: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function AdminAvailabilityToggle({
  isActive,
  loading = false,
  onToggle,
  activeLabel = "Disponible",
  inactiveLabel = "No disponible",
}: AdminAvailabilityToggleProps) {
  const label = isActive ? activeLabel : inactiveLabel;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        aria-label={`Cambiar a ${isActive ? inactiveLabel : activeLabel}`}
        aria-busy={loading}
        disabled={loading}
        onClick={() => onToggle(!isActive)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-wait ${
          isActive ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            isActive ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span
        className={`text-xs font-medium ${
          isActive ? "text-emerald-700" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
