import {
  SERVICE_AVAILABILITY_CONFIG,
  getServiceAvailability,
} from "@/types/ecommerce";

interface ServiceAvailabilityBadgeProps {
  item: { isActive: boolean };
}

export function ServiceAvailabilityBadge({ item }: ServiceAvailabilityBadgeProps) {
  const status = getServiceAvailability(item);
  const config = SERVICE_AVAILABILITY_CONFIG[status];

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
