export function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load<T>(key: string): T | null {
  const value = localStorage.getItem(key);

  if (!value) return null;

  return JSON.parse(value) as T;
}

export function remove(key: string) {
  localStorage.removeItem(key);
}

export function clear() {
  localStorage.clear();
}