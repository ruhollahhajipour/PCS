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
    wbs: "WBS-001",
    package: "Civil Works",
    budget: 1250000,
    actual: 1085000,
    variance: -165000,
    status: "On Budget",
  },
  {
    id: 2,
    wbs: "WBS-002",
    package: "Mechanical",
    budget: 2450000,
    actual: 2670000,
    variance: 220000,
    status: "Over Budget",
  },
];

export default function CostControl() {
  const [data] = useState(rows);

  const columns: GridColDef[] = [
    {
      field: "wbs",
      headerName: "WBS",
      width: 130,
    },
    {
      field: "package",
      headerName: "Package",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "budget",
      headerName: "Budget",
      width: 140,
      valueFormatter: (value) =>
        `$${Number(value).toLocaleString()}`,
    },
    {
      field: "actual",
      headerName: "Actual",
      width: 140,
      valueFormatter: (value) =>
        `$${Number(value).toLocaleString()}`,
    },
    {
      field: "variance",
      headerName: "Variance",
      width: 140,
      valueFormatter: (value) =>
        `$${Number(value).toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          color={
            params.value === "On Budget"
              ? "success"
              : "error"
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
          <VisibilityRoundedIcon sx={{ color: "#2563EB", cursor: "pointer" }} />
          <EditRoundedIcon sx={{ color: "#10B981", cursor: "pointer" }} />
          <DeleteRoundedIcon sx={{ color: "#EF4444", cursor: "pointer" }} />
        </Stack>
      ),
    },
  ];  return (
    <Box width="100%">
      <PageHeader
        title="Cost Control"
        subtitle="Budget Monitoring & Cost Performance"
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
            placeholder="Search WBS..."
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
            New Cost Package
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