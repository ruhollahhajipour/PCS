import { useState } from "react";

import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Stack,
  InputAdornment,
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

const rows = [
  {
    id: 1,
    code: "KGN",
    company: "Kousha Gaman Namavar",
    country: "Iran",
    currency: "USD",
    plants: 2,
    projects: 5,
    status: "Active",
  },
  {
    id: 2,
    code: "ADISH",
    company: "South Adish Gas Condensate Refinery",
    country: "Iran",
    currency: "USD",
    plants: 1,
    projects: 3,
    status: "Active",
  },
];

export default function Companies() {
  const [search, setSearch] = useState("");

  const columns: GridColDef[] = [
    { field: "code", headerName: "Code", width: 120 },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "country", headerName: "Country", width: 120 },
    { field: "currency", headerName: "Currency", width: 120 },
    { field: "plants", headerName: "Plants", width: 100 },
    { field: "projects", headerName: "Projects", width: 100 },
    { field: "status", headerName: "Status", width: 120 },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Companies
          </Typography>

          <Typography color="text.secondary">
            Enterprise Company Management
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.2,
            background:
              "linear-gradient(90deg,#4F46E5,#7C3AED)",
          }}
        >
          New Company
        </Button>
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 12px 35px rgba(0,0,0,.08)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          mb={3}
        >
          <TextField
            placeholder="Search Company..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <DataGrid
          rows={rows.filter(
            (r) =>
              r.company
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              r.code
                .toLowerCase()
                .includes(search.toLowerCase())
          )}
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