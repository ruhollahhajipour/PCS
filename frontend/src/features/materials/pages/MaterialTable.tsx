import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";

import type { Material } from "../../../models/material";

type Props = {
  rows: Material[];
  onView?: (row: Material) => void;
  onEdit?: (row: Material) => void;
  onDelete?: (row: Material) => void;
};

export default function MaterialTable({
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
      headerName: "Material",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 100,
    },
    {
      field: "currentStock",
      headerName: "Stock",
      width: 110,
    },
    {
      field: "unitPrice",
      headerName: "Price",
      width: 130,
      valueFormatter: (value) =>
        `$ ${Number(value).toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,

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
          onClick={() => onView?.(row as Material)}
        />,
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => onEdit?.(row as Material)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => onDelete?.(row as Material)}
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