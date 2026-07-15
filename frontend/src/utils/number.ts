export function formatNumber(
  value?: number,
  fractionDigits = 2
): string {
  if (value === undefined || value === null) {
    return "0";
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatCurrency(
  value?: number,
  currency = "USD"
): string {
  if (value === undefined || value === null) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function percent(
  value: number,
  total: number
): number {
  if (total === 0) return 0;

  return Number(((value / total) * 100).toFixed(2));
}