import {
  Chip,
} from "@mui/material";

import {
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import PCSDataGrid from "../../../../components/Common/PCSDataGrid";

import type { InventoryCount } from "../types/inventoryCount";

type Props = {

  rows: InventoryCount[];

  loading: boolean;

  onEdit: (item: InventoryCount) => void;

  onDelete: (id: number) => void;

};

export default function InventoryCountTable({

  rows,

  loading,

  onEdit,

  onDelete,

}: Props) {

  const columns: GridColDef[] = [

    {
      field: "countNo",
      headerName: "Count No",
      flex: 1,
    },

    {
      field: "warehouse",
      headerName: "Warehouse",
      flex: 1,
    },

    {
      field: "materialName",
      headerName: "Material",
      flex: 1.4,
    },

    {
      field: "systemQty",
      headerName: "System",
      width: 110,
    },

    {
      field: "countedQty",
      headerName: "Counted",
      width: 110,
    },

    {
      field: "variance",
      headerName: "Variance",
      width: 120,

      renderCell: (params) => {

        const value = Number(params.value);

        let color:
          | "success"
          | "warning"
          | "error" = "success";

        if (value !== 0)
          color = Math.abs(value) <= 5
            ? "warning"
            : "error";

        return (

          <Chip

            label={value}

            color={color}

            size="small"

          />

        );

      },

    },

    {
      field: "status",
      headerName: "Status",
      width: 140,
    },

    {
      field: "countDate",
      headerName: "Count Date",
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
            onEdit(params.row as InventoryCount)
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