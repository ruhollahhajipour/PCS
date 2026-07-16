import { useEffect, useMemo, useState } from "react";

import { Box, Paper } from "@mui/material";

import PageHeader from "../../components/Common/PageHeader";

import CompanyToolbar from "./CompanyToolbar";
import CompanyTable from "./CompanyTable";
import CompanyDialog from "./CompanyDialog";

import DeleteConfirmDialog from "../../components/Common/Dialog/DeleteConfirmDialog";

import CompanyService from "../../services/company.service";

import type { Company } from "../../models/company";

export default function Companies() {
  const [rows, setRows] = useState<Company[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const data = await CompanyService.getAll();
    setRows(data);
  };

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return rows;

    return rows.filter((c) => {
      return (
        c.code.toLowerCase().includes(keyword) ||
        c.shortName.toLowerCase().includes(keyword) ||
        c.name.toLowerCase().includes(keyword) ||
        c.country.toLowerCase().includes(keyword) ||
        c.city.toLowerCase().includes(keyword)
      );
    });
  }, [rows, search]);

  const handleAdd = () => {
    setSelectedCompany(null);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSaved = () => {
    loadCompanies();
  };

  const handleView = (row: Company) => {
    console.log(row);
  };

  const handleEdit = (row: Company) => {
    setSelectedCompany(row);
    setDialogOpen(true);
  };

  const handleDelete = (row: Company) => {
    setSelectedCompany(row);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompany) return;

    setDeleteLoading(true);

    await CompanyService.delete(selectedCompany.id);

    setDeleteLoading(false);

    setDeleteOpen(false);

    setSelectedCompany(null);

    loadCompanies();
  };

  return (
    <Box width="100%">
      <PageHeader
        title="Companies"
        subtitle="Enterprise Company Management"
      />

      <Paper
        sx={{
          p: 3,
          borderRadius: 5,
          background: "rgba(255,255,255,.82)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 20px 50px rgba(15,23,42,.08)",
        }}
      >
        <CompanyToolbar
          search={search}
          onSearchChange={setSearch}
          onAdd={handleAdd}
        />

        <CompanyTable
          rows={filteredRows}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <CompanyDialog
        open={dialogOpen}
        company={selectedCompany}
        onClose={handleClose}
        onSaved={handleSaved}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        loading={deleteLoading}
        title="Delete Company"
        message="Are you sure you want to delete this company?"
        itemName={selectedCompany?.name}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedCompany(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}