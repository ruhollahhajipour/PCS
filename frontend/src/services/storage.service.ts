class StorageService {
  set<T>(key: string, value: T): void {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }

  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);

    if (!value) return null;

    return JSON.parse(value) as T;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

export default new StorageService();