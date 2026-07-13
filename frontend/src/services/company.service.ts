import type { Company } from "../types/company";
import { companies } from "../mock/companies";

export const CompanyService = {
  getAll(): Company[] {
    return companies;
  },
};