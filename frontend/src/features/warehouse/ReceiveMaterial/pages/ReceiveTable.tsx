import { Stack, IconButton } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { GridColDef } from "@mui/x-data-grid";

import PCSDataGrid from "../../../../components/Common/PCSDataGrid";

import type { ReceiveMaterial } from "../types/receive";

type Props = {
  rows: ReceiveMaterial[];
  loading: boolean;

  onEdit: (item: ReceiveMaterial) => void;
  onDelete: (id: number) => void;
};

export default function ReceiveTable({
  rows,
  loading,
  onEdit,
  onDelete,
}: Props) {

  const columns: GridColDef[] = [

    {
      field: "receiptNo",
      headerName: "Receipt No",
      flex: 1,
      minWidth: 140,
    },

    {
      field: "poNo",
      headerName: "PO No",
      flex: 1,
      minWidth: 130,
    },

    {
      field: "supplier",
      headerName: "Supplier",
      flex: 1.3,
      minWidth: 180,
    },

    {
      field: "warehouse",
      headerName: "Warehouse",
      flex: 1,
      minWidth: 150,
    },

    {
      field: "itemCode",
      headerName: "Item Code",
      flex: 1,
      minWidth: 130,
    },

    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1.6,
      minWidth: 220,
    },

    {
      field: "quantity",
      headerName: "Qty",
      width: 90,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "unit",
      headerName: "Unit",
      width: 90,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,

      renderCell: (params) => (

        <Stack
          direction="row"
          spacing={1}
        >

          <IconButton
            size="small"
            onClick={() =>
              onEdit(params.row as ReceiveMaterial)
            }
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={() =>
              onDelete(
                (params.row as ReceiveMaterial).id
              )
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

        </Stack>

      ),

    },

  ];

  return (

    <PCSDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
    />

  );

}