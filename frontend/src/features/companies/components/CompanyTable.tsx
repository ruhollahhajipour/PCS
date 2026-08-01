import { Paper, Chip, IconButton } from "@mui/material";

import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

type Company = {
  id: number;
  code: string;
  name: string;
};

type Props = {
  rows: Company[];
};

export default function CompanyTable({
  rows,
}: Props) {

  const columns: GridColDef[] = [

    {
      field: "id",
      headerName: "ID",
      width: 90,
    },

    {
      field: "code",
      headerName: "Code",
      width: 180,

      renderCell: (params) => (

        <Chip
          icon={<BusinessRoundedIcon />}
          label={params.value}
          color="primary"
          variant="outlined"
        />

      ),
    },

    {
      field: "name",
      headerName: "Company Name",
      flex: 1,
      minWidth: 320,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,

      renderCell: () => (

        <>
          <IconButton color="primary">
            <EditRoundedIcon />
          </IconButton>

          <IconButton color="error">
            <DeleteRoundedIcon />
          </IconButton>
        </>

      ),
    },

  ];

  return (

    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        height: 650,
      }}
    >

      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        disableRowSelectionOnClick
        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#F8FAFC",
            fontWeight: 700,
            fontSize: 15,
          },

          "& .MuiDataGrid-row:hover": {
            bgcolor: "#F1F5F9",
          },

          "& .MuiDataGrid-cell": {
            borderColor: "#EEF2F7",
          },
        }}
      />

    </Paper>

  );

}