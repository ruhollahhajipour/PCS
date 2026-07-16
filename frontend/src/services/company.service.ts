import type { Company } from "../models/company";

let companies: Company[] = [
  {
    id: 1,
    code: "KGN",
    shortName: "KGN",
    name: "Kousha Gaman Niroo",
    country: "Iran",
    city: "Tehran",
    address: "Tehran",
    currency: "USD",
    status: "Active",
    registrationNumber: "REG-001",
    taxNumber: "TAX-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class CompanyService {
  async getAll(): Promise<Company[]> {
    return [...companies];
  }

  async getById(id: number): Promise<Company | undefined> {
    return companies.find((c) => c.id === id);
  }

  async create(
    company: Omit<Company, "id" | "createdAt" | "updatedAt">
  ): Promise<Company> {
    const newCompany: Company = {
      ...company,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    companies.push(newCompany);

    return newCompany;
  }

  async update(company: Company): Promise<void> {
    companies = companies.map((c) =>
      c.id === company.id
        ? {
            ...company,
            updatedAt: new Date().toISOString(),
          }
        : c
    );
  }

  async delete(id: number): Promise<void> {
    companies = companies.filter((c) => c.id !== id);
  }
}

export default new CompanyService();