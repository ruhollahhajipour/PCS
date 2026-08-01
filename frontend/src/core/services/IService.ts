export interface IService<T> {

  getAll(): Promise<T[]>;

  getById(id: number): Promise<T | null>;

  create(item: T): Promise<void>;

  update(item: T): Promise<void>;

  delete(id: number): Promise<void>;

  exists(id: number): Promise<boolean>;

  count(): Promise<number>;

}