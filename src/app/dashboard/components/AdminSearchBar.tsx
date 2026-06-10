import { Search } from "lucide-react";
import type { ReactNode } from "react";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  children?: ReactNode;
}

export function AdminSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Buscar...",
  children,
}: AdminSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {children}
        <button
          type="button"
          onClick={onSearch}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Buscar
        </button>
      </div>
    </div>
  );
}
