import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";

import type { Company } from "../../../models/company";

interface Props {
  rows: Company[];

  onView?: (row: Company) => void;

  onEdit?: (row: Company) => void;

  onDelete?: (row: Company) => void;
}

export default function CompanyTable({
  rows,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Code",
      width: 120,
    },
    {
      field: "name",
      headerName: "Company",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "country",
      headerName: "Country",
      width: 120,
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 120,
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
            params.value === "Active"
              ? "success"
              : "default"
          }
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      width: 110,

      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<VisibilityRoundedIcon />}
          label="View"
          onClick={() => onView?.(row)}
        />,

        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => onEdit?.(row)}
        />,

        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => onDelete?.(row)}
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
  );
}