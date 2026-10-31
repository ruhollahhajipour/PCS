import { LocalStorage } from "../storage/LocalStorage";
import { BaseRepository } from "./BaseRepository";

export abstract class BaseCRUDRepository<T extends { id: number }>
  extends BaseRepository<T> {

  protected storageKey: string;

constructor(storageKey: string) {

  super();

  this.storageKey = storageKey;

}
  async getAll(): Promise<T[]> {
    return LocalStorage.read<T>(this.storageKey);
  }

  async getById(id: number): Promise<T | null> {

    const data = await this.getAll();

    return data.find(x => x.id === id) ?? null;

  }

  async create(item: T): Promise<void> {

    const data = await this.getAll();

    data.push(item);

    LocalStorage.write(this.storageKey, data);

  }

  async update(item: T): Promise<void> {

    const data = await this.getAll();

    const index = data.findIndex(x => x.id === item.id);

    if (index >= 0)
      data[index] = item;

    LocalStorage.write(this.storageKey, data);

  }

  async delete(id: number): Promise<void> {

    const data = await this.getAll();

    LocalStorage.write(
      this.storageKey,
      data.filter(x => x.id !== id)
    );

  }

  async exists(id: number): Promise<boolean> {

    const data = await this.getAll();

    return data.some(x => x.id === id);

  }

  async count(): Promise<number> {

    const data = await this.getAll();

    return data.length;

  }

}