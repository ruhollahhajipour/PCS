import type { CostControl } from "../../../models/costControl";

let items: CostControl[] = [
  {
    id:"1",code: "CC-001",

    projectId: 1,

    wbs: "1.1.1",

    costCode: "CC-1001",

    discipline: "Piping",

    description: "Carbon Steel Pipes",

    budget: 250000,

    committed: 180000,

    actual: 120000,

    forecast: 230000,

    remaining: 110000,

    variance: 20000,

    currency: "USD",

    period: "2026-07",

    status: "Active",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  },
];

class CostControlService {
  async getAll(): Promise<CostControl[]> {
    return Promise.resolve(items);
  }

  async getById(id:string) {
    return Promise.resolve(
      items.find((x) => x.id === id)
    );
  }

  async create(item: CostControl) {
    items.push(item);
    return Promise.resolve();
  }

  async update(item: CostControl) {
    items = items.map((x) =>
      x.id === item.id ? item : x
    );

    return Promise.resolve();
  }

  async delete(id:string) {
    items = items.filter((x) => x.id !== id);
    return Promise.resolve();
  }
}

export default new CostControlService();