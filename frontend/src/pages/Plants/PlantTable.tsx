import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";

import type { Plant } from "../../models/plant";

type Props = {
  rows: Plant[];
  onView?: (row: Plant) => void;
  onEdit?: (row: Plant) => void;
  onDelete?: (row: Plant) => void;
};

export default function PlantTable({
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
      width: 140,
    },
    {
      field: "name",
      headerName: "Plant Name",
      flex: 1,
      minWidth: 260,
    },
    {
      field: "city",
      headerName: "City",
      width: 130,
    },
    {
      field: "country",
      headerName: "Country",
      width: 130,
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
          onClick={() => onView?.(row as Plant)}
        />,
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => onEdit?.(row as Plant)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => onDelete?.(row as Plant)}
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