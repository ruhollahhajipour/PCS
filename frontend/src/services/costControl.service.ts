import type { CostControl } from "../models/costControl";

const costControls: CostControl[] = [
  {
    id: 1,
    companyId: 1,
    plantId: 1,
    projectId: 1,
    wbsCode: "1.1.1",
    costCode: "CIV-001",
    description: "Civil Works",
    budgetCost: 2500000,
    committedCost: 950000,
    actualCost: 730000,
    forecastCost: 2380000,
    currency: "USD",
    progress: 28,
    variance: -120000,
    status: "Active",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-15",
  },
  {
    id: 2,
    companyId: 1,
    plantId: 1,
    projectId: 1,
    wbsCode: "2.3.5",
    costCode: "PIP-001",
    description: "Piping",
    budgetCost: 4200000,
    committedCost: 2100000,
    actualCost: 1680000,
    forecastCost: 4100000,
    currency: "USD",
    progress: 42,
    variance: -100000,
    status: "Active",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-15",
  },
];

class CostControlService {
  async getAll(): Promise<CostControl[]> {
    return Promise.resolve(costControls);
  }

  async getById(
    id: number
  ): Promise<CostControl | undefined> {
    return Promise.resolve(
      costControls.find((c) => c.id === id)
    );
  }

  async create(
    item: CostControl
  ): Promise<CostControl> {
    costControls.push(item);
    return Promise.resolve(item);
  }

  async update(
    item: CostControl
  ): Promise<CostControl> {
    const index = costControls.findIndex(
      (c) => c.id === item.id
    );

    if (index >= 0) {
      costControls[index] = item;
    }

    return Promise.resolve(item);
  }

  async delete(id: number): Promise<void> {
    const index = costControls.findIndex(
      (c) => c.id === id
    );

    if (index >= 0) {
      costControls.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new CostControlService();