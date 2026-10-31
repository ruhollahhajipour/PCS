import type { Procurement } from "../types/procurement";
import { procurementMock } from "../data/procurement.mock";

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class ProcurementService {
  private data: Procurement[] = [...procurementMock];

  async getAll(): Promise<Procurement[]> {
    await delay();
    return [...this.data];
  }

  async getById(
    id: number
  ): Promise<Procurement | null> {
    await delay();

    return (
      this.data.find((x) => x.id === id) ??
      null
    );
  }

  async create(
    item: Procurement
  ): Promise<Procurement> {
    await delay();

    const record: Procurement = {
      ...item,
      id: Date.now(),
      createdAt:
        item.createdAt ||
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    };

    this.data.unshift(record);

    return record;
  }

  async update(
    item: Procurement
  ): Promise<Procurement> {
    await delay();

    this.data = this.data.map((x) =>
      x.id === item.id
        ? {
            ...item,
            updatedAt:
              new Date().toISOString(),
          }
        : x
    );

    return item;
  }

  async delete(
    id: number
  ): Promise<void> {
    await delay();

    this.data = this.data.filter(
      (x) => x.id !== id
    );
  }

  async duplicate(
    id: number
  ): Promise<Procurement | null> {
    await delay();

    const item = this.data.find(
      (x) => x.id === id
    );

    if (!item) return null;

    const copy: Procurement = {
      ...item,
      id: Date.now(),
      prNo: `${item.prNo}-COPY`,
      poNo: "",
      status: "Draft",
      progress: 0,
      createdAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    };

    this.data.unshift(copy);

    return copy;
  }
}

export default new ProcurementService();