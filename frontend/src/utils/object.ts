export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function merge<T>(
  target: T,
  source: Partial<T>
): T {
  return {
    ...target,
    ...source,
  };
}

export function pick<T extends object>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};

  keys.forEach((key) => {
    result[key] = obj[key];
  });

  return result;
}

export function omit<T extends object>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
}

export function isEmpty(
  obj: Record<string, unknown>
): boolean {
  return Object.keys(obj).length === 0;
}