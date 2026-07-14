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

import PageHeader from "../../components/Common/PageHeader";

const rows = [
  {
    id: 1,
    code: "MAT-001",
    item: "Carbon Steel Pipe 8in",
    unit: "Meter",
    stock: 2450,
    reserved: 320,
    available: 2130,
    warehouse: "Central",
    status: "Available",
  },
  {
    id: 2,
    code: "MAT-002",
    item: "Butterfly Valve",
    unit: "EA",
    stock: 16,
    reserved: 8,
    available: 8,
    warehouse: "Mechanical",
    status: "Low Stock",
  },
];

export default function Warehouse() {
  const [data] = useState(rows);

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      width: 130,
    },
    {
      field: "item",
      headerName: "Material",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 90,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 110,
    },
    {
      field: "reserved",
      headerName: "Reserved",
      width: 120,
    },
    {
      field: "available",
      headerName: "Available",
      width: 120,
    },
    {
      field: "warehouse",
      headerName: "Warehouse",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={String(params.value)}
          color={
            params.value === "Available"
              ? "success"
              : "warning"
          }
        />
      ),
    },
  ];

  return (
    <Box width="100%">
      <PageHeader
        title="Warehouse"
        subtitle="Inventory Management"
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
            placeholder="Search Material..."
            sx={{ width: 350 }}
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
            New Material
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