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
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";

import PageHeader from "../../../components/Common/PageHeader";

const rows = [
  {
    id: 1,
    docNo: "DOC-MEC-001",
    title: "Piping Layout",
    revision: "Rev.03",
    discipline: "Mechanical",
    status: "Approved",
    date: "2026-07-14",
  },
  {
    id: 2,
    docNo: "DOC-ELC-008",
    title: "Single Line Diagram",
    revision: "Rev.01",
    discipline: "Electrical",
    status: "Review",
    date: "2026-07-10",
  },
];

export default function Documents() {
  const [data] = useState(rows);

  const columns: GridColDef[] = [
    {
      field: "docNo",
      headerName: "Document No.",
      width: 170,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "revision",
      headerName: "Revision",
      width: 110,
    },
    {
      field: "discipline",
      headerName: "Discipline",
      width: 140,
    },
    {
      field: "date",
      headerName: "Last Update",
      width: 140,
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
        title="Document Control"
        subtitle="Engineering Documents Management"
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
            placeholder="Search Document..."
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
            startIcon={<UploadFileRoundedIcon />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            Upload Document
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