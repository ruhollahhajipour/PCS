import type { Warehouse } from "../../../models/warehouse";

let warehouses: Warehouse[] = [
  {
    id: 1,
    plantId: 1,

    code: "WH-001",

    shortName: "MAIN",

    name: "Main Warehouse",

    location: "Bushehr",

    manager: "Warehouse Manager",

    description: "Central Warehouse",

    status: "Active",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  },
];

class WarehouseService {
  async getAll(): Promise<Warehouse[]> {
    return Promise.resolve(warehouses);
  }

  async getById(id: number) {
    return Promise.resolve(
      warehouses.find((x) => x.id === id)
    );
  }

  async create(item: Warehouse) {
    warehouses.push(item);

    return Promise.resolve();
  }

  async update(item: Warehouse) {
    warehouses = warehouses.map((x) =>
      x.id === item.id ? item : x
    );

    return Promise.resolve();
  }

  async delete(id: number) {
    warehouses = warehouses.filter(
      (x) => x.id !== id
    );

    return Promise.resolve();
  }
}

export default new WarehouseService();