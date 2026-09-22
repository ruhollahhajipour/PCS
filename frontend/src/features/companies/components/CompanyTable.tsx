import {
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";

import VisibilityRoundedIcon
  from "@mui/icons-material/VisibilityRounded";

import EditRoundedIcon
  from "@mui/icons-material/EditRounded";

import DeleteRoundedIcon
  from "@mui/icons-material/DeleteRounded";

import BusinessRoundedIcon
  from "@mui/icons-material/BusinessRounded";

import type { Company }
  from "../../../models/company";


type Props = {
  rows: Company[];

  loading?: boolean;

  onView?: (
    company: Company
  ) => void;

  onEdit?: (
    company: Company
  ) => void;

  onDelete?: (
    id: string
  ) => void;
};


export default function CompanyTable({
  rows,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: Props) {

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      width: 150,

      renderCell: (
        params: GridRenderCellParams<Company>
      ) => (
        <Chip
          icon={
            <BusinessRoundedIcon />
          }
          label={params.value}
          color="primary"
          variant="outlined"
          size="small"
        />
      ),
    },


    {
      field: "name",
      headerName: "Company Name",
      flex: 2,
      minWidth: 280,
    },


    {
      field: "shortName",
      headerName: "Short Name",
      flex: 1,
      minWidth: 130,
    },


    {
      field: "country",
      headerName: "Country",
      flex: 1,
      minWidth: 120,
    },


    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 120,
    },


    {
      field: "phone",
      headerName: "Phone",
      flex: 1.2,
      minWidth: 150,
    },


    {
      field: "status",
      headerName: "Status",
      width: 120,

      renderCell: (
        params: GridRenderCellParams<Company>
      ) => (
        <Chip
          size="small"
          label={
            params.value === "Active"
              ? "Active"
              : "Inactive"
          }
          color={
            params.value === "Active"
              ? "success"
              : "default"
          }
        />
      ),
    },


    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,

      renderCell: (
        params: GridRenderCellParams<Company>
      ) => (
        <>
          <Tooltip title="View">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                onView?.(params.row)
              }
            >
              <VisibilityRoundedIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>


          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="warning"
              onClick={() =>
                onEdit?.(params.row)
              }
            >
              <EditRoundedIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>


          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                onDelete?.(
                  params.row.id
                )
              }
            >
              <DeleteRoundedIcon
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
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
        border:
          "1px solid #E2E8F0",
        height: 650,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        pageSizeOptions={[
          10,
          25,
          50,
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders":
            {
              bgcolor: "#F8FAFC",
              fontWeight: 700,
              fontSize: 14,
            },

          "& .MuiDataGrid-row:hover":
            {
              bgcolor: "#F8FAFC",
            },

          "& .MuiDataGrid-cell":
            {
              borderColor:
                "#EEF2F7",
            },
        }}
      />
    </Paper>
  );
}