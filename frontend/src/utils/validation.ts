export function required(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return true;
}

export function minLength(
  value: string,
  length: number
): boolean {
  return value.trim().length >= length;
}

export function maxLength(
  value: string,
  length: number
): boolean {
  return value.trim().length <= length;
}

export function email(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function number(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

export function decimal(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value);
}

export function phone(value: string): boolean {
  return /^[0-9+\-()\s]+$/.test(value);
}

export function url(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function between(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}