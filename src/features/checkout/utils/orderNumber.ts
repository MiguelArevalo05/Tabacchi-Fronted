export function formatPublicOrderNumber(order: {
  id: string;
  createdAt: string;
}): string {
  const year = new Date(order.createdAt).getFullYear();
  const suffix = order.id.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `GT-${year}-${suffix}`;
}

export function formatOrderSuccessDate(value: string): string {
  const date = new Date(value);
  const datePart = date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("es-PE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} | ${timePart}`;
}
