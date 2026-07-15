import type { Company } from "../models/company";

const companies: Company[] = [
  {
    id: 1,
    code: "KGN",
    name: "Kousha Gaman Namavar",
    shortName: "KGN",
    country: "Iran",
    city: "Tehran",
    address: "Tehran",
    currency: "USD",
    taxNumber: "123456789",
    registrationNumber: "987654321",
    status: "Active",
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: 2,
    code: "ADISH",
    name: "South Adish Gas Condensate Refinery",
    shortName: "ADISH",
    country: "Iran",
    city: "Bushehr",
    address: "South Pars",
    currency: "USD",
    taxNumber: "223344556",
    registrationNumber: "556677889",
    status: "Active",
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
];

class CompanyService {
  async getAll(): Promise<Company[]> {
    return Promise.resolve(companies);
  }

  async getById(id: number): Promise<Company | undefined> {
    return Promise.resolve(companies.find((c) => c.id === id));
  }

  async create(company: Company): Promise<Company> {
    companies.push(company);
    return Promise.resolve(company);
  }

  async update(company: Company): Promise<Company> {
    const index = companies.findIndex((c) => c.id === company.id);

    if (index >= 0) {
      companies[index] = company;
    }

    return Promise.resolve(company);
  }

  async delete(id: number): Promise<void> {
    const index = companies.findIndex((c) => c.id === id);

    if (index >= 0) {
      companies.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new CompanyService();