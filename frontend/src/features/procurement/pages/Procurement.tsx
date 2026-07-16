import { useEffect, useState } from "react";

import CRUDPage from "../../../components/Common/CRUD/CRUDPage";

import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderDialog from "../dialogs/PurchaseOrderDialog";

import PurchaseOrderService from "../../../services/purchaseOrder.service";

import type { PurchaseOrder } from "../../../models/purchaseOrder";

export default function Procurement() {
  const [rows, setRows] = useState<PurchaseOrder[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data =
      await PurchaseOrderService.getAll();

    setRows(data);
  }

  const filteredRows = rows.filter((x) =>
    (
      x.poNumber +
      x.title +
      x.description +
      x.status
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <CRUDPage
        title="Procurement"
        subtitle="Purchase Orders Management"
        search={search}
        onSearchChange={setSearch}
        addLabel="New Purchase Order"
        searchPlaceholder="Search Purchase Order..."
        onAdd={() =>
          setDialogOpen(true)
        }
      >
        <PurchaseOrderTable
          rows={filteredRows}
          onView={(r: any) =>
            console.log("VIEW", r)
          }
          onEdit={(r: any) =>
            console.log("EDIT", r)
          }
          onDelete={async (r: any) => {
            await PurchaseOrderService.delete(
              r.id
            );

            loadData();
          }}
        />
      </CRUDPage>

      <PurchaseOrderDialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        onSaved={loadData}
      />
    </>
  );
}