import type { Material } from "../../../models/material";

let materials: Material[] = [
  {
    id:"1",

    warehouseId: 1,

    code: "MAT-0001",

    shortName: "PIPE-8",

    name: "Carbon Steel Pipe 8 Inch",

    category: "Piping",

    unit: "Meter",

    specification: "ASTM A106 Gr.B",

    manufacturer: "Mannesmann",

    partNumber: "CS-PIPE-8",

    minStock: 100,

    maxStock: 1000,

    currentStock: 420,

    unitPrice: 125,

    currency: "USD",

    status: "Active",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  },
];

class MaterialService {
  async getAll(): Promise<Material[]> {
    return Promise.resolve(materials);
  }

  async getById(id:string) {
    return Promise.resolve(
      materials.find((x) => x.id === id)
    );
  }

  async create(item: Material) {
    materials.push(item);

    return Promise.resolve();
  }

  async update(item: Material) {
    materials = materials.map((x) =>
      x.id === item.id ? item : x
    );

    return Promise.resolve();
  }

  async delete(id:string) {
    materials = materials.filter(
      (x) => x.id !== id
    );

    return Promise.resolve();
  }
}

export default new MaterialService();