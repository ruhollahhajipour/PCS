import type { IRepository } from "./IRepository";

export abstract class BaseRepository<T>
implements IRepository<T> {

  abstract getAll(): Promise<T[]>;

  abstract getById(id: number): Promise<T | null>;

  abstract create(item: T): Promise<void>;

  abstract update(item: T): Promise<void>;

  abstract delete(id: number): Promise<void>;

  abstract exists(id: number): Promise<boolean>;

  abstract count(): Promise<number>;

}