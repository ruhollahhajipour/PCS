import { useEffect, useState } from "react";

import { Box, Paper } from "@mui/material";

import PageHeader from "../../components/Common/PageHeader";

import CompanyToolbar from "./CompanyToolbar";
import CompanyTable from "./CompanyTable";
import CompanyDialog from "./CompanyDialog";

import CompanyService from "../../services/company.service";

import type { Company } from "../../models/company";

export default function Companies() {
  const [rows, setRows] = useState<Company[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const data = await CompanyService.getAll();
    setRows(data);
  };

  const handleAdd = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleView = (row: Company) => {
    console.log("VIEW", row);
  };

  const handleEdit = (row: Company) => {
    console.log("EDIT", row);
    setDialogOpen(true);
  };

  const handleDelete = async (row: Company) => {
    await CompanyService.delete(row.id);
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
        <CompanyToolbar onAdd={handleAdd} />

        <CompanyTable
          rows={rows}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <CompanyDialog
        open={dialogOpen}
        onClose={handleClose}
      />
    </Box>
  );
}