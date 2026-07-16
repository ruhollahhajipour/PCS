import { useEffect, useState } from "react";

import CRUDPage from "../../../components/Common/CRUD/CRUDPage";

import WarehouseTable from "./WarehouseTable";
import WarehouseDialog from "../dialogs/WarehouseDialog";

import WarehouseService from "../services/warehouse.service";

import type { Warehouse } from "../../../models/warehouse";

export default function WarehousePage() {
  const [rows, setRows] = useState<Warehouse[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await WarehouseService.getAll();

    setRows(data);
  }

  const filteredRows = rows.filter((x) =>
    (
      x.code +
      x.shortName +
      x.name +
      x.location +
      x.manager
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <CRUDPage
        title="Warehouses"
        subtitle="Warehouse Management"
        search={search}
        onSearchChange={setSearch}
        addLabel="New Warehouse"
        searchPlaceholder="Search Warehouse..."
        onAdd={() => setDialogOpen(true)}
      >
        <WarehouseTable
          rows={filteredRows}
          onView={(r: any) =>
            console.log("VIEW", r)
          }
          onEdit={(r: any) =>
            console.log("EDIT", r)
          }
          onDelete={async (r: any) => {
            await WarehouseService.delete(r.id);

            loadData();
          }}
        />
      </CRUDPage>

      <WarehouseDialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        onSaved={loadData}
      />
    </>
  );
}