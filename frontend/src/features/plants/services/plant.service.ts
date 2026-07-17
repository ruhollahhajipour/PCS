import type { Plant } from "../types/plant";

import { plantMock } from "../data/plant.mock";

const STORAGE_KEY = "PCS_PLANTS";

class PlantService {
  private load(): Plant[] {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(plantMock)
      );

      return [...plantMock];
    }

    return JSON.parse(raw);
  }

  private save(data: Plant[]) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }

  async getAll() {
    return this.load();
  }

  async create(plant: Plant) {
    const data = this.load();

    data.push(plant);

    this.save(data);
  }

  async update(plant: Plant) {
    const data = this.load();

    this.save(
      data.map((x) =>
        x.id === plant.id
          ? plant
          : x
      )
    );
  }

  async delete(id: number) {
    const data = this.load();

    this.save(
      data.filter(
        (x) => x.id !== id
      )
    );
  }
}

export default new PlantService();