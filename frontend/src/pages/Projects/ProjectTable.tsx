import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";

import type { Project } from "../../models/project";

type Props = {
  rows: Project[];
  onView?: (row: Project) => void;
  onEdit?: (row: Project) => void;
  onDelete?: (row: Project) => void;
};

export default function ProjectTable({
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
      headerName: "Project Name",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "budget",
      headerName: "Budget",
      width: 160,
      valueFormatter: (value) =>
        `$ ${Number(value).toLocaleString()}`,
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 110,
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
          onClick={() => onView?.(row as Project)}
        />,
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() => onEdit?.(row as Project)}
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() => onDelete?.(row as Project)}
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