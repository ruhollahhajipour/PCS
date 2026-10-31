import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";

import type { Vendor } from "../../../models/vendor";

type Props = {
  rows: Vendor[];

  onView?: (row: Vendor) => void;

  onEdit?: (row: Vendor) => void;

  onDelete?: (row: Vendor) => void;
};

export default function VendorTable({
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
      headerName: "Vendor",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "country",
      headerName: "Country",
      width: 130,
    },
    {
      field: "city",
      headerName: "City",
      width: 130,
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 110,
    },
    {
      field: "paymentTerm",
      headerName: "Payment",
      width: 140,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 140,
      renderCell: (params) => (
        <Rating
          value={Number(params.value)}
          readOnly
          size="small"
        />
      ),
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
          onClick={() =>
            onView?.(row as Vendor)
          }
        />,
        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() =>
            onEdit?.(row as Vendor)
          }
        />,
        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() =>
            onDelete?.(row as Vendor)
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