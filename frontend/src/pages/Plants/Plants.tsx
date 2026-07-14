import { useState } from "react";

import {
  Box,
  Paper,
  Stack,
  Button,
  TextField,
  Chip,
  InputAdornment,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import PageHeader from "../../components/Common/PageHeader";

const rows = [
  {
    id: 1,
    code: "PLT-001",
    name: "South Adish Refinery",
    location: "Bushehr",
    company: "KGN",
    projects: 6,
    status: "Active",
  },
  {
    id: 2,
    code: "PLT-002",
    name: "North Adish Utility",
    location: "Bushehr",
    company: "KGN",
    projects: 2,
    status: "Under Construction",
  },
];

export default function Plants() {
  const [data] = useState(rows);

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      width: 120,
    },
    {
      field: "name",
      headerName: "Plant Name",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "location",
      headerName: "Location",
      width: 160,
    },
    {
      field: "company",
      headerName: "Company",
      width: 120,
    },
    {
      field: "projects",
      headerName: "Projects",
      width: 110,
    },
    {
      field: "status",
      headerName: "Status",
      width: 170,
      renderCell: (params) => (
        <Chip
          size="small"
          color={
            params.value === "Active"
              ? "success"
              : "warning"
          }
          label={String(params.value)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      renderCell: () => (
        <Stack direction="row" spacing={1}>
          <VisibilityRoundedIcon
            sx={{ cursor: "pointer", color: "#2563EB" }}
          />

          <EditRoundedIcon
            sx={{ cursor: "pointer", color: "#10B981" }}
          />

          <DeleteRoundedIcon
            sx={{ cursor: "pointer", color: "#EF4444" }}
          />
        </Stack>
      ),
    },
  ];  return (
    <Box width="100%">
      <PageHeader
        title="Plants"
        subtitle="Plant Management"
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
        <Stack
          direction="row"
          justifyContent="space-between"
          mb={3}
        >
          <TextField
            size="small"
            placeholder="Search Plant..."
            sx={{ width: 360 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            New Plant
          </Button>
        </Stack>

        <DataGrid
          rows={data}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#F8FAFC",
              fontWeight: 700,
            },

            "& .MuiDataGrid-row:hover": {
              bgcolor: "#EEF4FB",
            },
          }}
        />
      </Paper>
    </Box>
  );
}