import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type {
  GridColDef,
} from "@mui/x-data-grid";

import VisibilityRoundedIcon
  from "@mui/icons-material/VisibilityRounded";

import EditRoundedIcon
  from "@mui/icons-material/EditRounded";

import DeleteRoundedIcon
  from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";

import type { Plant }
  from "../../../models/plant";


type Props = {
  rows: Plant[];

  onView?: (
    row: Plant
  ) => void;

  onEdit?: (
    row: Plant
  ) => void;

  onDelete?: (
    row: Plant
  ) => void;
};


export default function PlantTable({
  rows,
  onView,
  onEdit,
  onDelete,
}: Props) {

  const columns: GridColDef<Plant>[] = [

    {
      field: "code",

      headerName: "Code",

      width: 130,
    },


    {
      field: "shortName",

      headerName: "Short Name",

      width: 140,

      valueGetter: (
        _value,
        row
      ) =>
        row.shortName ?? "",
    },


    {
      field: "name",

      headerName: "Plant Name",

      flex: 1,

      minWidth: 280,
    },


    {
      field: "address",

      headerName: "Address",

      flex: 1.5,

      minWidth: 220,

      valueGetter: (
        _value,
        row
      ) =>
        row.address ?? "",
    },


    {
      field: "phone",

      headerName: "Phone",

      width: 150,

      valueGetter: (
        _value,
        row
      ) =>
        row.phone ?? "",
    },


    {
      field: "email",

      headerName: "Email",

      width: 220,

      valueGetter: (
        _value,
        row
      ) =>
        row.email ?? "",
    },


    {
      field: "isActive",

      headerName: "Status",

      width: 130,

      sortable: true,

      renderCell: (
        params
      ) => (

        <Chip
          size="small"
          label={
            params.row.isActive
              ? "Active"
              : "Inactive"
          }
          color={
            params.row.isActive
              ? "success"
              : "default"
          }
          variant="outlined"
        />

      ),
    },


    {
      field: "actions",

      type: "actions",

      headerName: "Actions",

      width: 130,

      getActions: ({
        row,
      }) => [

        <GridActionsCellItem
          key="view"
          icon={
            <VisibilityRoundedIcon />
          }
          label="View"
          onClick={() =>
            onView?.(row)
          }
        />,

        <GridActionsCellItem
          key="edit"
          icon={
            <EditRoundedIcon />
          }
          label="Edit"
          onClick={() =>
            onEdit?.(row)
          }
        />,

        <GridActionsCellItem
          key="delete"
          icon={
            <DeleteRoundedIcon />
          }
          label="Delete"
          onClick={() =>
            onDelete?.(row)
          }
        />,
      ],
    },
  ];


  return (

    <DataGrid
      rows={rows}

      columns={columns}

      autoHeight

      disableRowSelectionOnClick

      pageSizeOptions={[
        10,
        20,
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

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#F8FAFC",
          fontWeight: 700,
        },

        "& .MuiDataGrid-row:hover": {
          backgroundColor: "#F8FAFC",
        },
      }}
    />

  );
}