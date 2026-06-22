import {
  CATALOG_AVAILABILITY_CONFIG,
  getCatalogAvailability,
  type CatalogAvailabilityStatus,
} from "@/features/products/types/ecommerce";

interface CatalogAvailabilityBadgeProps {
  item: { isActive: boolean; stock?: number };
  /** En tienda pública solo llegan productos activos; el stock define si hay unidades. */
  mode?: "admin" | "store";
}

export function CatalogAvailabilityBadge({
  item,
  mode = "admin",
}: CatalogAvailabilityBadgeProps) {
  let status: CatalogAvailabilityStatus = getCatalogAvailability(item);

  if (mode === "store" && item.isActive && item.stock !== undefined && item.stock < 1) {
    status = "out_of_stock";
  }

  const config = CATALOG_AVAILABILITY_CONFIG[status];

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
