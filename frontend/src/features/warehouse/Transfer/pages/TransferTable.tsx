import {
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import PCSDataGrid from "../../../../components/Common/PCSDataGrid";

import type { TransferMaterial } from "../types/transfer";

type Props = {

  rows: TransferMaterial[];

  loading: boolean;

  onEdit: (item: TransferMaterial) => void;

  onDelete: (id: number) => void;

};

export default function TransferTable({

  rows,

  loading,

  onEdit,

  onDelete,

}: Props) {

  const columns: GridColDef[] = [

    {
      field: "transferNo",
      headerName: "Transfer No",
      flex: 1.1,
    },

    {
      field: "fromWarehouse",
      headerName: "From",
      flex: 1,
    },

    {
      field: "toWarehouse",
      headerName: "To",
      flex: 1,
    },

    {
      field: "materialName",
      headerName: "Material",
      flex: 1.4,
    },

    {
      field: "quantity",
      headerName: "Qty",
      width: 110,
    },

    {
      field: "unit",
      headerName: "Unit",
      width: 100,
    },

    {
      field: "status",
      headerName: "Status",
      width: 130,
    },

    {
      field: "transferDate",
      headerName: "Transfer Date",
      width: 160,
    },

    {
      field: "actions",
      type: "actions",
      width: 90,

      getActions: (params) => [

        <GridActionsCellItem
          icon={<EditRoundedIcon />}
          label="Edit"
          onClick={() =>
            onEdit(params.row as TransferMaterial)
          }
        />,

        <GridActionsCellItem
          icon={<DeleteRoundedIcon />}
          label="Delete"
          onClick={() =>
            onDelete(params.row.id)
          }
          showInMenu
        />,

      ],

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