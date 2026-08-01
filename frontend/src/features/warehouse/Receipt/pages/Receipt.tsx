import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import PCSDataGrid from "../../../../components/Common/PCSDataGrid/PCSDataGrid";
import StatusChip from "../../../../components/Common/StatusChip";

import ReceiptDialog from "../dialogs/ReceiptDialog";
import ReceiptToolbar from "../components/ReceiptToolbar";
import ReceiptKPIs from "../components/ReceiptKPIs";

import useReceipt from "../hooks/useReceipt";

import type { Receipt } from "../types/receipt";

export default function Receipt() {

  const {
    items,
    loading,
    refresh,
    create,
    update,
    remove,
  } = useReceipt();

  const [open, setOpen] = useState(false);

  const [selected, setSelected] =
    useState<Receipt | null>(null);

  const [search, setSearch] =
    useState("");

  const rows = useMemo(() => {

    const q = search.toLowerCase();

    return items.filter((x) =>

      x.receiptNo.toLowerCase().includes(q) ||

      x.poNo.toLowerCase().includes(q) ||

      x.itemCode.toLowerCase().includes(q) ||

      x.itemName.toLowerCase().includes(q) ||

      x.supplier.toLowerCase().includes(q)

    );

  }, [items, search]);

  async function handleSave(item: Receipt) {

    if (selected) {

      await update(item);

    } else {

      await create(item);

    }

    setSelected(null);

  }

  async function handleDelete(id: number) {

    if (confirm("Delete Receipt ?")) {

      await remove(id);

    }

  }

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Warehouse Receipt
      </Typography>

      <ReceiptKPIs items={items} />

      <ReceiptToolbar
        search={search}
        onSearch={setSearch}
        onRefresh={refresh}
        onNew={() => {
          setSelected(null);
          setOpen(true);
        }}
      />

      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
                <PCSDataGrid
          rows={rows}
          loading={loading}
          columns={[
            {
              field: "receiptNo",
              headerName: "Receipt No",
              flex: 1,
            },
            {
              field: "poNo",
              headerName: "PO No",
              flex: 1,
            },
            {
              field: "itemCode",
              headerName: "Item Code",
              flex: 1,
            },
            {
              field: "itemName",
              headerName: "Item Name",
              flex: 2,
            },
            {
              field: "supplier",
              headerName: "Supplier",
              flex: 2,
            },
            {
              field: "warehouse",
              headerName: "Warehouse",
              flex: 1.5,
            },
            {
              field: "location",
              headerName: "Location",
              flex: 1.2,
            },
            {
              field: "quantity",
              headerName: "Qty",
              flex: 0.8,
            },
            {
              field: "unit",
              headerName: "Unit",
              flex: 0.7,
            },
            {
              field: "receiveDate",
              headerName: "Receive Date",
              flex: 1.2,
            },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              renderCell: (params: any) => (
                <StatusChip value={params.value} />
              ),
            },
            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              flex: 1.6,
              renderCell: (params: any) => (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <button
                    onClick={() => {
                      setSelected(params.row);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(params.row.id)
                    }
                  >
                    Delete
                  </button>
                </Box>
              ),
            },
          ]}
        />
              </Paper>

      <ReceiptDialog
        open={open}
        receipt={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        onSave={handleSave}
      />

    </Box>

  );

}