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
    return Promise.resolve(companies);
  }

  async getById(id: number): Promise<Company | undefined> {
    return Promise.resolve(
      companies.find((c) => c.id === id)
    );
  }

  async create(company: Company): Promise<void> {
    companies.push(company);
    return Promise.resolve();
  }

  async update(company: Company): Promise<void> {
    companies = companies.map((c) =>
      c.id === company.id ? company : c
    );

    return Promise.resolve();
  }

  async delete(id: number): Promise<void> {
    companies = companies.filter(
      (c) => c.id !== id
    );

    return Promise.resolve();
  }
}

export default new CompanyService();