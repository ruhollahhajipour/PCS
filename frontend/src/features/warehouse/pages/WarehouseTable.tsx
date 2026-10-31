import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";

import type { Warehouse } from "../../../models/warehouse";

type Props = {
  rows: Warehouse[];
  onView?: (row: Warehouse) => void;
  onEdit?: (row: Warehouse) => void;
  onDelete?: (row: Warehouse) => void;
};

export default function WarehouseTable({
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
      field: "shortName",
      headerName: "Short Name",
      width: 150,
    },
    {
      field: "name",
      headerName: "Warehouse",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "location",
      headerName: "Location",
      width: 170,
    },
    {
      field: "manager",
      headerName: "Manager",
      width: 180,
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
          onClick={() => onView?.(row as Warehouse)}
        />,
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => onEdit?.(row as Warehouse)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => onDelete?.(row as Warehouse)}
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
    />
  );
}