import { useMemo, useState } from "react";

import CRUDPage from "../../../../components/Common/CRUD/CRUDPage";

import useTransfer from "../hooks/useTransfer";

import TransferToolbar from "../components/TransferToolbar";
import TransferKPIs from "../components/TransferKPIs";
import TransferTable from "./TransferTable";
import TransferDialog from "../dialogs/TransferDialog";

import type { TransferMaterial } from "../types/transfer";

export default function Transfer() {

  const {
    items,
    loading,
    create,
    update,
    remove,
  } = useTransfer();

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editing, setEditing] =
    useState<TransferMaterial | null>(null);

  const filtered = useMemo(() => {

    const keyword = search.toLowerCase();

    return items.filter((x) =>

      x.transferNo.toLowerCase().includes(keyword) ||

      x.materialName.toLowerCase().includes(keyword) ||

      x.materialCode.toLowerCase().includes(keyword) ||

      x.fromWarehouse.toLowerCase().includes(keyword) ||

      x.toWarehouse.toLowerCase().includes(keyword)

    );

  }, [items, search]);

  function handleAdd() {

    setEditing(null);

    setOpen(true);

  }

  function handleEdit(item: TransferMaterial) {

    setEditing(item);

    setOpen(true);

  }

  function handleSave(item: TransferMaterial) {

    if (editing)

      update(item);

    else

      create(item);

    setOpen(false);

  }

  function handleDelete(id: number) {

    if (window.confirm("Delete this Transfer?"))

      remove(id);

  }

  return (

    <CRUDPage

      title="Transfer Material"

      subtitle="Warehouse Material Transfer"

      search={search}

      onSearchChange={setSearch}

      addLabel="New Transfer"

      searchPlaceholder="Search Transfer..."

      onAdd={handleAdd}

    >

      <TransferKPIs

        items={filtered}

      />

      <TransferToolbar

        search={search}

        onSearchChange={setSearch}

        onAdd={handleAdd}

      />

      <TransferTable

        rows={filtered}

        loading={loading}

        onEdit={handleEdit}

        onDelete={handleDelete}

      />

      <TransferDialog

        open={open}

        onClose={() => setOpen(false)}

        onSave={handleSave}

        initialData={editing}

      />

    </CRUDPage>

  );

}