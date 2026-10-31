import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import type { CostControl } from "../../../models/costControl";

type Props = {
  rows: CostControl[];

  onView?: (row: CostControl) => void;

  onEdit?: (row: CostControl) => void;

  onDelete?: (row: CostControl) => void;
};

const money = (v: number) =>
  `$ ${v.toLocaleString()}`;

export default function CostControlTable({
  rows,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "wbs",
      headerName: "WBS",
      width: 120,
    },
    {
      field: "costCode",
      headerName: "Cost Code",
      width: 150,
    },
    {
      field: "discipline",
      headerName: "Discipline",
      width: 150,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "budget",
      headerName: "Budget",
      width: 140,
      valueFormatter: (v) =>
        money(Number(v)),
    },
    {
      field: "committed",
      headerName: "Committed",
      width: 140,
      valueFormatter: (v) =>
        money(Number(v)),
    },
    {
      field: "actual",
      headerName: "Actual",
      width: 140,
      valueFormatter: (v) =>
        money(Number(v)),
    },
    {
      field: "forecast",
      headerName: "Forecast",
      width: 140,
      valueFormatter: (v) =>
        money(Number(v)),
    },
    {
      field: "remaining",
      headerName: "Remaining",
      width: 140,
      valueFormatter: (v) =>
        money(Number(v)),
    },
    {
      field: "variance",
      headerName: "Variance",
      width: 140,
      valueFormatter: (v) =>
        money(Number(v)),
    },
    {
      field: "actions",
      type: "actions",
      width: 110,

      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<VisibilityRoundedIcon />}
          label="View"
          onClick={() =>
            onView?.(row as CostControl)
          }
        />,
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() =>
            onEdit?.(row as CostControl)
          }
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() =>
            onDelete?.(row as CostControl)
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