import { useEffect, useState } from "react";

import CompanyService from "../services/company.service";
import type { Company } from "../types/company";

export default function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const data = await CompanyService.getAll();

    setCompanies(data);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(company: Company) {
    await CompanyService.create(company);
    await load();
  }

  async function update(company: Company) {
    await CompanyService.update(company);
    await load();
  }

  async function remove(id: number) {
    await CompanyService.delete(id);
    await load();
  }

  return {
    companies,
    loading,
    reload: load,
    create,
    update,
    remove,
  };
}