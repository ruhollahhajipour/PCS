import http from "../../../api/http";

import type { Plant } from "../types/plant";

export interface CreatePlantPayload {
  code: string;

  name: string;

  shortName?: string | null;

  description?: string | null;

  companyId: string;

  address?: string | null;

  phone?: string | null;

  email?: string | null;

  isActive: boolean;
}

class PlantService {
  async getAll(): Promise<Plant[]> {
    const response =
      await http.get<Plant[]>(
        "/Plants"
      );

    return response.data;
  }


  async getByCompanyId(
    companyId: string
  ): Promise<Plant[]> {
    const response =
      await http.get<Plant[]>(
        `/Plants/company/${companyId}`
      );

    return response.data;
  }


  async getById(
    id: string
  ): Promise<Plant> {
    const response =
      await http.get<Plant>(
        `/Plants/${id}`
      );

    return response.data;
  }


  async create(
    plant: Plant
  ): Promise<string> {
    const response =
      await http.post<string>(
        "/Plants",
        {
          code: plant.code,

          name: plant.name,

          shortName:
            plant.shortName ?? null,

          description:
            plant.description ?? null,

          companyId:
            plant.companyId,

          address:
            plant.address ?? null,

          phone:
            plant.phone ?? null,

          email:
            plant.email ?? null,

          isActive:
            plant.isActive,
        }
      );

    return response.data;
  }


  async update(
    plant: Plant
  ): Promise<void> {
    await http.put(
      `/Plants/${plant.id}`,
      {
        code: plant.code,

        name: plant.name,

        shortName:
          plant.shortName ?? null,

        description:
          plant.description ?? null,

        companyId:
          plant.companyId,

        address:
          plant.address ?? null,

        phone:
          plant.phone ?? null,

        email:
          plant.email ?? null,

        isActive:
          plant.isActive,
      }
    );
  }


  async delete(
    id: string
  ): Promise<void> {
    await http.delete(
      `/Plants/${id}`
    );
  }
}

export default new PlantService();