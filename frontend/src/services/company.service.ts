import type { Company } from "../types/company";

let companies: Company[] = [
  {
    id: 1,
    code: "KGN",
    name: "Kousha Gaman Niroo",
    shortName: "KGN",
    country: "Iran",
    city: "Tehran",
    address: "Tehran",
    postalCode: "1111111111",
    phone: "+98 21 00000000",
    email: "info@kgn.ir",
    website: "https://kgn.ir",
    currency: "USD",
    fiscalYearStart: "2026-01-01",
    status: "Active",
    description: "Default Company",
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