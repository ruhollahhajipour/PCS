export function sortBy<T>(
  items: T[],
  key: keyof T,
  asc = true
): T[] {
  return [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];

    if (av === bv) return 0;

    if (asc) {
      return av > bv ? 1 : -1;
    }

    return av < bv ? 1 : -1;
  });
}

export function groupBy<T>(
  items: T[],
  key: keyof T
): Record<string, T[]> {
  return items.reduce((result, item) => {
    const value = String(item[key]);

    if (!result[value]) {
      result[value] = [];
    }

    result[value].push(item);

    return result;
  }, {} as Record<string, T[]>);
}

export function unique<T>(
  items: T[],
  key: keyof T
): T[] {
  const map = new Map();

  items.forEach((item) => {
    map.set(item[key], item);
  });

  return Array.from(map.values());
}

export function sum<T>(
  items: T[],
  selector: (item: T) => number
): number {
  return items.reduce(
    (total, item) => total + selector(item),
    0
  );
}

export function average<T>(
  items: T[],
  selector: (item: T) => number
): number {
  if (!items.length) return 0;

  return sum(items, selector) / items.length;
}