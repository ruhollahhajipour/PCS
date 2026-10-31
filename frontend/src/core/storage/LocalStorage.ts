export class LocalStorage {

  static read<T>(key: string): T[] {

    const raw = localStorage.getItem(key);

    return raw ? JSON.parse(raw) : [];

  }

  static write<T>(key: string, data: T[]) {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

  }

}