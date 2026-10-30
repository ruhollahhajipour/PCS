import { toLatinDigits } from "./jalali";

const faNumber = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
const faQty = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 3 });

/** Integer money amounts (Rial) with Persian digits and thousand separators. */
export function formatMoney(value: number): string {
  return faNumber.format(Math.round(value));
}

/** Quantities keep up to 3 decimals (e.g. 12.5 ton). */
export function formatQty(value: number): string {
  return faQty.format(value);
}

export function formatInt(value: number): string {
  return faNumber.format(value);
}

/** Parses user-typed numbers: Persian digits, thousand separators, "٫" decimals. */
export function parseNumber(input: string): number {
  const cleaned = toLatinDigits(input).replace(/[,\s]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/** Shows a number in an input box: plain Latin digits, no grouping. */
export function numberToInput(value: number): string {
  return value === 0 ? "" : String(value);
}

export function round(value: number, digits = 6): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}
