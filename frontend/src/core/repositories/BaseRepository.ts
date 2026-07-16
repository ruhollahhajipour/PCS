export default abstract class BaseRepository<T extends { id: number }> {
  protected items: T[];

  constructor(seed: T[] = []) {
    this.items = [...seed];
  }

  async getAll(): Promise<T[]> {
    return [...this.items];
  }

  async getById(id: number): Promise<T | undefined> {
    return this.items.find(x => x.id === id);
  }

  async create(item: T): Promise<T> {
    this.items.push(item);
    return item;
  }

  async update(item: T): Promise<T> {
    const index = this.items.findIndex(
      x => x.id === item.id
    );

    if (index >= 0) {
      this.items[index] = item;
    }

    return item;
  }

  async delete(id: number): Promise<void> {
    this.items = this.items.filter(
      x => x.id !== id
    );
  }

  async exists(id: number): Promise<boolean> {
    return this.items.some(
      x => x.id === id
    );
  }

  async count(): Promise<number> {
    return this.items.length;
  }

  async clear(): Promise<void> {
    this.items = [];
  }
}