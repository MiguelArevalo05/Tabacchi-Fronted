import type { ReactNode } from "react";

export function AdminCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

export function AdminTable({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={["w-full text-sm", className].join(" ")}>{children}</table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200">
      {children}
    </thead>
  );
}

export function AdminTh({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <th
      className={[
        "px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6 lg:px-8",
        alignClass,
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
}

export function AdminEmptyState({ message, colSpan }: { message: string; colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center text-slate-500">
        {message}
      </td>
    </tr>
  );
}
