import http from "../../../api/http";

export interface CreateProjectRequest {
  code: string;
  name: string;
  description?: string;
  companyId: string;
  startDate: string;
  endDate: string;
  budget: number;
}

class ProjectSetupService {
  async create(
    data: CreateProjectRequest
  ) {
    const response =
      await http.post(
        "/Projects",
        data
      );

    return response.data;
  }
}

export default new ProjectSetupService();