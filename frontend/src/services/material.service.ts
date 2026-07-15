import type { Material } from "../models/material";

const materials: Material[] = [
  {
    id: 1,
    code: "MAT-001",
    name: "Carbon Steel Pipe",
    description: "ASTM A106 Gr.B",
    category: "Piping",
    unit: "Meter",
    warehouse: "Main Warehouse",
    minimumStock: 200,
    currentStock: 480,
    reservedStock: 60,
    unitPrice: 125,
    currency: "USD",
    manufacturer: "Mannesmann",
    status: "Available",
    createdAt: "2026-01-01",
    updatedAt: "2026-07-15",
  },
  {
    id: 2,
    code: "MAT-002",
    name: "Gate Valve 6in",
    description: "Class 300",
    category: "Valve",
    unit: "Each",
    warehouse: "Main Warehouse",
    minimumStock: 20,
    currentStock: 12,
    reservedStock: 3,
    unitPrice: 870,
    currency: "USD",
    manufacturer: "Velan",
    status: "Low Stock",
    createdAt: "2026-01-01",
    updatedAt: "2026-07-15",
  },
];

class MaterialService {
  async getAll(): Promise<Material[]> {
    return Promise.resolve(materials);
  }

  async getById(
    id: number
  ): Promise<Material | undefined> {
    return Promise.resolve(
      materials.find((m) => m.id === id)
    );
  }

  async create(
    material: Material
  ): Promise<Material> {
    materials.push(material);
    return Promise.resolve(material);
  }

  async update(
    material: Material
  ): Promise<Material> {
    const index = materials.findIndex(
      (m) => m.id === material.id
    );

    if (index >= 0) {
      materials[index] = material;
    }

    return Promise.resolve(material);
  }

  async delete(id: number): Promise<void> {
    const index = materials.findIndex(
      (m) => m.id === id
    );

    if (index >= 0) {
      materials.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new MaterialService();