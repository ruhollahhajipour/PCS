import {
  useMemo,
  useState,
} from "react";

import {
  Box,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";

import VisibilityRoundedIcon
  from "@mui/icons-material/VisibilityRounded";

import EditRoundedIcon
  from "@mui/icons-material/EditRounded";

import DeleteRoundedIcon
  from "@mui/icons-material/DeleteRounded";

import PCSDataGrid
  from "../../../components/Common/PCSDataGrid/PCSDataGrid";

import StatusChip
  from "../../../components/Common/StatusChip";

import ConfirmDialog
  from "../../../components/Common/Dialog/ConfirmDialog";

import CompanyToolbar
  from "../components/CompanyToolbar";

import CompanyDialog
  from "../dialogs/CompanyDialog";

import useCompanies
  from "../hooks/useCompanies";

import type { Company }
  from "../../../models/company";

import type {
  GridRenderCellParams,
} from "@mui/x-data-grid";


export default function Companies() {

  const {
    companies,
    loading,
    create,
    update,
    remove,
    reload,
  } = useCompanies();


  const [search, setSearch] =
    useState("");


  const [open, setOpen] =
    useState(false);


  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);


  const [deleteOpen, setDeleteOpen] =
    useState(false);


  const [deleteId, setDeleteId] =
    useState<string | null>(null);


  const filtered = useMemo(() => {

    const q =
      search.trim().toLowerCase();


    if (!q) {
      return companies;
    }


    return companies.filter(
      (company) =>
        company.code
          .toLowerCase()
          .includes(q) ||

        company.name
          .toLowerCase()
          .includes(q) ||

        (
          company.nationalId ?? ""
        )
          .toLowerCase()
          .includes(q) ||

        (
          company.address ?? ""
        )
          .toLowerCase()
          .includes(q) ||

        (
          company.phone ?? ""
        )
          .toLowerCase()
          .includes(q) ||

        (
          company.email ?? ""
        )
          .toLowerCase()
          .includes(q)
    );

  }, [
    companies,
    search,
  ]);


  async function handleSave(
    company: Company
  ) {

    if (selectedCompany) {
      await update(company);
    }
    else {
      await create(company);
    }


    setSelectedCompany(null);

    setOpen(false);
  }


  async function handleDelete() {

    if (!deleteId) {
      return;
    }


    await remove(deleteId);


    setDeleteOpen(false);

    setDeleteId(null);
  }


  function handleEdit(
    company: Company
  ) {

    setSelectedCompany(company);

    setOpen(true);
  }


  function handleView(
    company: Company
  ) {

    setSelectedCompany(company);

    setOpen(true);
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
          mt: 2,
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
              minWidth: 130,
            },


            {
              field: "name",
              headerName: "Company Name",
              flex: 2,
              minWidth: 280,
            },


            {
              field: "nationalId",
              headerName: "National ID",
              flex: 1.1,
              minWidth: 140,
            },


            {
              field: "address",
              headerName: "Address",
              flex: 2,
              minWidth: 220,
            },


            {
              field: "phone",
              headerName: "Phone",
              flex: 1.2,
              minWidth: 150,
            },


            {
              field: "email",
              headerName: "Email",
              flex: 1.5,
              minWidth: 180,
            },


            {
              field: "status",
              headerName: "Status",
              flex: 0.8,
              minWidth: 110,

              renderCell: (
                params: GridRenderCellParams<Company>
              ) => (
                <StatusChip
                  value={
                    params.row.status
                  }
                />
              ),
            },


            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              filterable: false,
              width: 160,

              renderCell: (
                params: GridRenderCellParams<Company>
              ) => (
                <>

                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleView(
                          params.row
                        )
                      }
                    >
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>


                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() =>
                        handleEdit(
                          params.row
                        )
                      }
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>


                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
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