import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";

import { useEffect, useState } from "react";

import CompanyService from "../../services/company.service";

import type {
  Company,
} from "../../types/company";

export default function CompanyList() {
  const [rows, setRows] = useState<Company[]>([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    const data =
      await CompanyService.getAll();

    setRows(data);
  }

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      width: 120,
    },
    {
      field: "name",
      headerName: "Company Name",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "country",
      headerName: "Country",
      width: 140,
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          size="small"
          color={
            params.value === "Active"
              ? "success"
              : "default"
          }
          label={params.value}
        />
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Companies
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage companies
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Company
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          height: 650,
          borderRadius: 3,
          p: 1,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        />
      </Paper>
    </Stack>
  );
}