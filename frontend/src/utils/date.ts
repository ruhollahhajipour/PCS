export function formatDate(
  value?: string | Date
): string {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatDateTime(
  value?: string | Date
): string {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}