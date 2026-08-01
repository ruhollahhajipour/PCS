import { BaseRepository } from "../repositories";

export default class BaseService<
  T extends { id: number }
> {
  protected repository: BaseRepository<T>;

  constructor(
    repository: BaseRepository<T>
  ) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.getAll();
  }

  async getById(id: number) {
    return this.repository.getById(id);
  }

  async create(item: T) {
    return this.repository.create(item);
  }

  async update(item: T) {
    return this.repository.update(item);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }

  async exists(id: number) {
    return this.repository.exists(id);
  }

  async count() {
    return this.repository.count();
  }
}