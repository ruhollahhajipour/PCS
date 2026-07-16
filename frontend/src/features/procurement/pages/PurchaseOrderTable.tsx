import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import Chip from "@mui/material/Chip";

import type { PurchaseOrder } from "../../../models/purchaseOrder";

type Props = {
  rows: PurchaseOrder[];

  onView?: (row: PurchaseOrder) => void;

  onEdit?: (row: PurchaseOrder) => void;

  onDelete?: (row: PurchaseOrder) => void;
};

export default function PurchaseOrderTable({
  rows,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "poNumber",
      headerName: "PO No.",
      width: 170,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 130,
    },
    {
      field: "deliveryDate",
      headerName: "Delivery",
      width: 130,
    },
    {
      field: "totalAmount",
      headerName: "Total",
      width: 140,
      valueFormatter: (v) =>
        `$ ${Number(v).toLocaleString()}`,
    },
    {
      field: "receivedAmount",
      headerName: "Received",
      width: 140,
      valueFormatter: (v) =>
        `$ ${Number(v).toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,

      renderCell: (params) => {
        const status = String(params.value);

        let color:
          | "default"
          | "warning"
          | "success"
          | "error"
          | "info" = "default";

        switch (status) {
          case "Approved":
            color = "success";
            break;

          case "Pending":
            color = "warning";
            break;

          case "Cancelled":
            color = "error";
            break;

          case "Closed":
            color = "info";
            break;
        }

        return (
          <Chip
            size="small"
            label={status}
            color={color}
          />
        );
      },
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
            onView?.(row as PurchaseOrder)
          }
        />,

        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() =>
            onEdit?.(row as PurchaseOrder)
          }
        />,

        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() =>
            onDelete?.(row as PurchaseOrder)
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