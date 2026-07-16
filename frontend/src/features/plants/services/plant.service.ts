import type { Plant } from "../../../models/plant";

let plants: Plant[] = [
  {
    id: 1,
    companyId: 1,
    code: "ADS",
    shortName: "ADS",
    name: "Adish South",
    country: "Iran",
    city: "Bushehr",
    address: "South Pars",
    timezone: "Asia/Tehran",
    currency: "USD",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class PlantService {
  async getAll(): Promise<Plant[]> {
    return Promise.resolve(plants);
  }

  async getById(id: number) {
    return Promise.resolve(
      plants.find((p) => p.id === id)
    );
  }

  async create(data: Plant) {
    plants.push(data);
    return Promise.resolve();
  }

  async update(data: Plant) {
    plants = plants.map((p) =>
      p.id === data.id ? data : p
    );

    return Promise.resolve();
  }

  async delete(id: number) {
    plants = plants.filter(
      (p) => p.id !== id
    );

    return Promise.resolve();
  }
}

export default new PlantService();