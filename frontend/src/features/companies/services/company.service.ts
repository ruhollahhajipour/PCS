import type { Company } from "../types/company";

import { companyMock } from "../data/company.mock";

const STORAGE_KEY = "PCS_COMPANIES";

class CompanyService {
  private loadStorage(): Company[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(companyMock)
      );

      return [...companyMock];
    }

    return JSON.parse(raw);
  }

  private saveStorage(data: Company[]) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }

  async getAll() {
    return this.loadStorage();
  }

  async create(company: Company) {
    const data = this.loadStorage();

    data.push(company);

    this.saveStorage(data);
  }

  async update(company: Company) {
    const data = this.loadStorage();

    const result = data.map((x) =>
      x.id === company.id ? company : x
    );

    this.saveStorage(result);
  }

  async delete(id: number) {
    const data = this.loadStorage();

    const result = data.filter(
      (x) => x.id !== id
    );

    this.saveStorage(result);
  }

  async getById(id: number) {
    const data = this.loadStorage();

    return (
      data.find((x) => x.id === id) ??
      null
    );
  }
}

export default new CompanyService();