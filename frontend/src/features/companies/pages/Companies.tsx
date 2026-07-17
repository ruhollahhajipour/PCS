import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import PCSDataGrid from "../../../components/Common/PCSDataGrid/PCSDataGrid";
import StatusChip from "../../../components/Common/StatusChip";

import ConfirmDialog from "../../../components/Common/Dialog/ConfirmDialog";

import CompanyToolbar from "../components/CompanyToolbar";
import CompanyDialog from "../dialogs/CompanyDialog";

import useCompanies from "../hooks/useCompanies";

import type { Company } from "../types/company";

export default function Companies() {
  const {
    companies,
    loading,
    create,
    update,
    remove,
    reload,
  } = useCompanies();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return companies.filter((x) => {
      return (
        x.code.toLowerCase().includes(q) ||
        x.name.toLowerCase().includes(q) ||
        x.country.toLowerCase().includes(q) ||
        x.city.toLowerCase().includes(q)
      );
    });
  }, [companies, search]);

  async function handleSave(
    company: Company
  ) {
    if (selectedCompany) {
      await update(company);
    } else {
      await create(company);
    }

    setOpen(false);

    setSelectedCompany(null);
  }

  async function handleDelete() {
    if (deleteId == null) return;

    await remove(deleteId);

    setDeleteOpen(false);

    setDeleteId(null);
  }

  return (
    <Box>

      <CompanyToolbar
        search={search}
        onSearch={setSearch}
        onRefresh={reload}
        onNew={() => {
          setSelectedCompany(null);
          setOpen(true);
        }}
      />

      <Paper
        sx={{
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <PCSDataGrid
          rows={filtered}
          loading={loading}
          columns={[
            {
              field: "code",
              headerName: "Code",
              flex: 1,
            },

            {
              field: "name",
              headerName: "Company",
              flex: 2,
            },

            {
              field: "country",
              headerName: "Country",
              flex: 1,
            },

            {
              field: "city",
              headerName: "City",
              flex: 1,
            },

            {
              field: "phone",
              headerName: "Phone",
              flex: 1.4,
            },

            {
              field: "status",
              headerName: "Status",
              flex: 1,

              renderCell: (params: any) => (
                <StatusChip value={params.value} />
              ),
            },

            {
              field: "actions",

              headerName: "Actions",

              sortable: false,

              filterable: false,

              width: 170,

              renderCell: (params: any) => (
                <>

                  <Tooltip title="View">
                    <IconButton
                      color="primary"
                    >
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      color="warning"
                      onClick={() => {
                        setSelectedCompany(
                          params.row
                        );

                        setOpen(true);
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteId(
                          params.row.id
                        );

                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Tooltip>

                </>
              ),
            },
          ]}
        />
      </Paper>

      <CompanyDialog
        open={open}
        company={selectedCompany}
        onClose={() => {
          setOpen(false);
          setSelectedCompany(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Company"
        message="Are you sure you want to delete this company?"
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
      />

    </Box>
  );
}