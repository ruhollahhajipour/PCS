import type { CostItem } from "../types/costItem";

import { costMock } from "../data/cost.mock";

const STORAGE_KEY = "PCS_COST_CONTROL";

class CostService {
  private load(): CostItem[] {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(costMock)
      );

      return [...costMock];
    }

    return JSON.parse(raw);
  }

  private save(data: CostItem[]) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }

  async getAll() {
    return this.load();
  }

  async create(item: CostItem) {
    const data = this.load();

    data.push(item);

    this.save(data);
  }

  async update(item: CostItem) {
    const data = this.load();

    this.save(
      data.map((x) =>
        x.id === item.id ? item : x
      )
    );
  }

  async delete(id: number) {
    const data = this.load();

    this.save(
      data.filter((x) => x.id !== id)
    );
  }
}

export default new CostService();