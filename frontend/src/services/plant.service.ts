export interface Plant {
  id: number;

  companyId: number;

  code: string;

  name: string;

  location: string;

  status: "Active" | "Inactive";
}

const plants: Plant[] = [
  {
    id: 1,
    companyId: 1,
    code: "ADISH-REF",
    name: "South Adish Gas Condensate Refinery",
    location: "Bushehr",
    status: "Active",
  },
  {
    id: 2,
    companyId: 1,
    code: "UTILITY",
    name: "Utility Plant",
    location: "Bushehr",
    status: "Active",
  },
];

class PlantService {
  async getAll(): Promise<Plant[]> {
    return Promise.resolve(plants);
  }

  async getByCompany(
    companyId: number
  ): Promise<Plant[]> {
    return Promise.resolve(
      plants.filter((p) => p.companyId === companyId)
    );
  }

  async getById(
    id: number
  ): Promise<Plant | undefined> {
    return Promise.resolve(
      plants.find((p) => p.id === id)
    );
  }

  async create(plant: Plant): Promise<Plant> {
    plants.push(plant);
    return Promise.resolve(plant);
  }

  async update(plant: Plant): Promise<Plant> {
    const index = plants.findIndex(
      (p) => p.id === plant.id
    );

    if (index >= 0) {
      plants[index] = plant;
    }

    return Promise.resolve(plant);
  }

  async delete(id: number): Promise<void> {
    const index = plants.findIndex(
      (p) => p.id === id
    );

    if (index >= 0) {
      plants.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new PlantService();