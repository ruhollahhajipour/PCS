import http from "../../../api/http";

import type { Project } from "../../../models/project";

class ProjectService {
  async getAll(): Promise<Project[]> {
    const response = await http.get<Project[]>(
      "/Projects"
    );

    return response.data;
  }

  async getById(id: string): Promise<Project> {
    const response = await http.get<Project>(
      `/Projects/${id}`
    );

    return response.data;
  }

  async create(project: Project): Promise<string> {
    const response = await http.post<string>(
      "/Projects",
      {
        code: project.code,
        name: project.name,
        shortName: project.shortName,
        description: project.description,

        companyId: project.companyId,
        plantId: project.plantId,

        contractNo: project.contractNo,

        client: project.client,
        contractor: project.contractor,
        consultant: project.consultant,

        startDate: project.startDate,
        finishDate:
          project.finishDate ??
          project.endDate,

        budget: project.budget,
        actualCost: project.actualCost,

        currency: project.currency,

        progress: project.progress,
        spi: project.spi,
        cpi: project.cpi,

        isActive:
          project.isActive ?? true,
      }
    );

    return response.data;
  }

  async update(project: Project): Promise<void> {
    await http.put(
      `/Projects/${project.id}`,
      {
        code: project.code,

        name: project.name,

        shortName: project.shortName,

        description: project.description,

        companyId: project.companyId,

        plantId: project.plantId,

        contractNo: project.contractNo,

        client: project.client,

        contractor: project.contractor,

        consultant: project.consultant,

        startDate: project.startDate,

        endDate:
          project.endDate ??
          project.finishDate,

        budget: project.budget,

        actualCost: project.actualCost,

        currency: project.currency,

        progress: project.progress,

        spi: project.spi,

        cpi: project.cpi,

        isActive:
          project.isActive ?? true,
      }
    );
  }

  async delete(id: string): Promise<void> {
    await http.delete(`/Projects/${id}`);
  }
}

export default new ProjectService();