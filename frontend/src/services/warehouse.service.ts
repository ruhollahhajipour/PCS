import type { Warehouse } from "../models/warehouse";

const warehouses: Warehouse[] = [
  {
    id: 1,
    companyId: 1,
    plantId: 1,
    code: "WH-001",
    name: "Main Warehouse",
    location: "Bushehr Site",
    keeper: "Warehouse Manager",
    totalItems: 1842,
    totalValue: 12500000,
    currency: "USD",
    status: "Active",
    createdAt: "2026-01-01",
    updatedAt: "2026-07-15",
  },
  {
    id: 2,
    companyId: 1,
    plantId: 1,
    code: "WH-002",
    name: "Mechanical Warehouse",
    location: "Mechanical Area",
    keeper: "Mechanical Store",
    totalItems: 735,
    totalValue: 4850000,
    currency: "USD",
    status: "Active",
    createdAt: "2026-02-01",
    updatedAt: "2026-07-15",
  },
];

class WarehouseService {
  async getAll(): Promise<Warehouse[]> {
    return Promise.resolve(warehouses);
  }

  async getById(
    id: number
  ): Promise<Warehouse | undefined> {
    return Promise.resolve(
      warehouses.find((w) => w.id === id)
    );
  }

  async create(
    warehouse: Warehouse
  ): Promise<Warehouse> {
    warehouses.push(warehouse);
    return Promise.resolve(warehouse);
  }

  async update(
    warehouse: Warehouse
  ): Promise<Warehouse> {
    const index = warehouses.findIndex(
      (w) => w.id === warehouse.id
    );

    if (index >= 0) {
      warehouses[index] = warehouse;
    }

    return Promise.resolve(warehouse);
  }

  async delete(id: number): Promise<void> {
    const index = warehouses.findIndex(
      (w) => w.id === id
    );

    if (index >= 0) {
      warehouses.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new WarehouseService();