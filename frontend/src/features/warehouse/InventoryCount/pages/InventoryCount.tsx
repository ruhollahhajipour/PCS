import { useMemo, useState } from "react";

import CRUDPage from "../../../../components/Common/CRUD/CRUDPage";

import useInventoryCount from "../hooks/useInventoryCount";

import InventoryCountToolbar from "../components/InventoryCountToolbar";
import InventoryCountKPIs from "../components/InventoryCountKPIs";
import InventoryCountTable from "./InventoryCountTable";
import InventoryCountDialog from "../dialogs/InventoryCountDialog";

import type { InventoryCount } from "../types/inventoryCount";

export default function InventoryCount() {

  const {
    items,
    loading,
    create,
    update,
    remove,
  } = useInventoryCount();

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editing, setEditing] =
    useState<InventoryCount | null>(null);

  const filtered = useMemo(() => {

    const keyword = search.toLowerCase();

    return items.filter((x) =>

      x.countNo.toLowerCase().includes(keyword) ||

      x.materialCode.toLowerCase().includes(keyword) ||

      x.materialName.toLowerCase().includes(keyword) ||

      x.warehouse.toLowerCase().includes(keyword) ||

      x.location.toLowerCase().includes(keyword)

    );

  }, [items, search]);

  function handleAdd() {

    setEditing(null);

    setOpen(true);

  }

  function handleEdit(item: InventoryCount) {

    setEditing(item);

    setOpen(true);

  }

  function handleSave(item: InventoryCount) {

    if (editing)
      update(item);
    else
      create(item);

    setOpen(false);

  }

  function handleDelete(id: number) {

    if (window.confirm("Delete Inventory Count?"))
      remove(id);

  }

  return (

    <CRUDPage

      title="Inventory Count"

      subtitle="Warehouse Physical Inventory"

      search={search}

      onSearchChange={setSearch}

      addLabel="New Count"

      searchPlaceholder="Search Inventory..."

      onAdd={handleAdd}

    >

      <InventoryCountKPIs

        items={filtered}

      />

      <InventoryCountToolbar

        search={search}

        onSearchChange={setSearch}

        onAdd={handleAdd}

      />

      <InventoryCountTable

        rows={filtered}

        loading={loading}

        onEdit={handleEdit}

        onDelete={handleDelete}

      />

      <InventoryCountDialog

        open={open}

        onClose={() => setOpen(false)}

        onSave={handleSave}

        initialData={editing}

      />

    </CRUDPage>

  );

}