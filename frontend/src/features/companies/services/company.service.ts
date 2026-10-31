import http from "../../../api/http";

import type { Company } from "../../../models/company";

type CompanyApiDto = {
  id: string;
  code: string;
  name: string;
  nationalId?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
};

type CreateCompanyDto = {
  code: string;
  name: string;
  nationalId?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
};

function mapFromApi(
  dto: CompanyApiDto
): Company {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    nationalId: dto.nationalId ?? "",
    address: dto.address ?? "",
    phone: dto.phone ?? "",
    email: dto.email ?? "",
    status: dto.isActive
      ? "Active"
      : "Inactive",
    createdAt: "",
    updatedAt: "",
  };
}

function mapToApi(
  company: Company
): CreateCompanyDto {
  return {
    code: company.code.trim(),
    name: company.name.trim(),

    nationalId:
      company.nationalId?.trim() || null,

    address:
      company.address?.trim() || null,

    phone:
      company.phone?.trim() || null,

    email:
      company.email?.trim() || null,

    isActive:
      company.status === "Active",
  };
}

class CompanyService {
  async getAll(): Promise<Company[]> {
    const response =
      await http.get<CompanyApiDto[]>(
        "/Companies"
      );

    return response.data.map(mapFromApi);
  }

  async getById(
    id: string
  ): Promise<Company | undefined> {
    try {
      const response =
        await http.get<CompanyApiDto>(
          `/Companies/${id}`
        );

      return mapFromApi(response.data);
    }
    catch (error: any) {
      if (
        error?.response?.status === 404
      ) {
        return undefined;
      }

      throw error;
    }
  }

  async create(
    company: Company
  ): Promise<string> {
    const response =
      await http.post<string>(
        "/Companies",
        mapToApi(company)
      );

    return response.data;
  }

  async update(
    company: Company
  ): Promise<void> {
    await http.put(
      `/Companies/${company.id}`,
      mapToApi(company)
    );
  }

  async delete(
    id: string
  ): Promise<void> {
    await http.delete(
      `/Companies/${id}`
    );
  }
}

export default new CompanyService();