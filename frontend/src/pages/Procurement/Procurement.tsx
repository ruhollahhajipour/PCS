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
    pr: "PR-24001",
    po: "PO-24015",
    vendor: "Siemens AG",
    item: "Electrical Panels",
    amount: 285000,
    progress: "85%",
    status: "Approved",
  },
  {
    id: 2,
    pr: "PR-24002",
    po: "PO-24018",
    vendor: "Schneider Electric",
    item: "MCC",
    amount: 167500,
    progress: "45%",
    status: "Pending",
  },
];

export default function Procurement() {
  const [data] = useState(rows);

  const columns: GridColDef[] = [
    {
      field: "pr",
      headerName: "PR No.",
      width: 130,
    },
    {
      field: "po",
      headerName: "PO No.",
      width: 130,
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "item",
      headerName: "Material",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "amount",
      headerName: "Amount ($)",
      width: 140,
      valueFormatter: (value) =>
        Number(value).toLocaleString(),
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 110,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          size="small"
          label={String(params.value)}
          color={
            params.value === "Approved"
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
        title="Procurement"
        subtitle="Purchase Requisition / Purchase Order Management"
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
            placeholder="Search Procurement..."
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
            New PR
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