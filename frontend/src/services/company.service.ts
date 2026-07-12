import { companies } from "../mock/companies";

export const CompanyService = {
  getAll() {
    return companies;
  },

  getById(id: number) {
    return companies.find((x) => x.id === id);
  },
};