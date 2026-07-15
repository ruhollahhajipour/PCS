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

import type { Company } from "../../models/company";


export default function CompanyList() {

  const [rows, setRows] = useState<Company[]>([]);


  useEffect(() => {
    loadCompanies();
  }, []);


  const loadCompanies = async () => {
    const data = await CompanyService.getAll();

    setRows(data);
  };


  const columns: GridColDef[] = [

    {
      field: "code",
      headerName: "Code",
      width: 130,
    },


    {
      field: "name",
      headerName: "Company Name",
      flex: 1,
      minWidth: 250,
    },


    {
      field: "country",
      headerName: "Country",
      width: 150,
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
          label={params.value}
          color={
            params.value === "Active"
              ? "success"
              : "default"
          }
          size="small"
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
            color="text.secondary"
          >
            Enterprise Company Management
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
        sx={{
          height: 650,
          p: 1,
          borderRadius: 3,
        }}
      >

        <DataGrid

          rows={rows}

          columns={columns}

          disableRowSelectionOnClick


          pageSizeOptions={[
            10,
            25,
            50,
          ]}


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