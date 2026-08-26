import http from "../../../api/http";

export interface CreateCompanyRequest {
  code: string;
  name: string;
  nationalId?: string;
  address?: string;
  phone?: string;
  email?: string;
}

class CompanySetupService {
  async create(
    data: CreateCompanyRequest
  ): Promise<string> {
    const response =
      await http.post<string>(
        "/Companies",
        data
      );

    return response.data;
  }
}

export default new CompanySetupService();