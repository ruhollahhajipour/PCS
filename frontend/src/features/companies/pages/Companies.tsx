import { useState } from "react";
import { Box } from "@mui/material";

import CompanyToolbar from "../components/CompanyToolbar";
import CompanyTable from "../components/CompanyTable";
import CompanyDialog from "../dialogs/CompanyDialog";

import type { Company } from "../types/company";

const initialCompanies: Company[] = [
  {
    id: 1,
    code: "KGN",
    name: "Kousha Gaman Namavar",
    shortName: "KGN",
    logo: "",
    country: "Iran",
    city: "Tehran",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    status: "Active",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 2,
    code: "PMC",
    name: "Petroleum Management Company",
    shortName: "PMC",
    logo: "",
    country: "Iran",
    city: "Tehran",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    status: "Active",
    createdAt: "",
    updatedAt: "",
  },
];

export default function Companies() {
  const [search, setSearch] = useState("");

  const [rows, setRows] =
    useState<Company[]>(initialCompanies);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);

  const filteredRows = rows.filter(
    (c) =>
      c.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.code
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  function handleNew() {
    setSelectedCompany(null);
    setDialogOpen(true);
  }

  function handleRefresh() {
    setSearch("");
  }

  async function handleSave(company: Company) {
    setRows((prev) => {
      const exists = prev.some(
        (x) => x.id === company.id
      );

      if (exists) {
        return prev.map((x) =>
          x.id === company.id ? company : x
        );
      }

      return [...prev, company];
    });
  }

  return (
    <Box>

      <CompanyToolbar
        search={search}
        onSearch={setSearch}
        onNew={handleNew}
        onRefresh={handleRefresh}
      />

      <CompanyTable
        rows={filteredRows}
      />

      <CompanyDialog
        open={dialogOpen}
        company={selectedCompany}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

    </Box>
  );
}