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
    code: "PRJ-001",
    name: "South Adish EPC",
    manager: "R. Hajipour",
    progress: "82%",
    budget: "$125 M",
    status: "Running",
  },
  {
    id: 2,
    code: "PRJ-002",
    name: "Utilities Upgrade",
    manager: "A. Karimi",
    progress: "38%",
    budget: "$42 M",
    status: "Planning",
  },
];

export default function Projects() {
  const [data] = useState(rows);

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      width: 120,
    },
    {
      field: "name",
      headerName: "Project",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "manager",
      headerName: "Manager",
      width: 180,
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 110,
    },
    {
      field: "budget",
      headerName: "Budget",
      width: 140,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          color={
            params.value === "Running"
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
          <VisibilityRoundedIcon sx={{ color: "#2563EB", cursor: "pointer" }} />
          <EditRoundedIcon sx={{ color: "#10B981", cursor: "pointer" }} />
          <DeleteRoundedIcon sx={{ color: "#EF4444", cursor: "pointer" }} />
        </Stack>
      ),
    },
  ];  return (
    <Box width="100%">
      <PageHeader
        title="Projects"
        subtitle="Project Management"
      />

      <Paper
        sx={{
          p: 3,
          borderRadius: 5,
          background: "rgba(255,255,255,.82)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 20px 50px rgba(126, 184, 196, 0.08)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          mb={3}
        >
          <TextField
            size="small"
            placeholder="Search Project..."
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
            New Project
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