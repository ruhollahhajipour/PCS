import { useMemo, useState } from "react";

import CRUDPage from "../../../../components/Common/CRUD/CRUDPage";

import ReceiveTable from "./ReceiveTable";
import ReceiveDialog from "../dialogs/ReceiveDialog";
import ReceiveKPIs from "../components/ReceiveKPIs";

import useReceive from "../hooks/useReceive";

import type { ReceiveMaterial } from "../types/receive";

export default function Receive() {

  const {
    items,
    loading,
    create,
    update,
    remove,
  } = useReceive();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selected, setSelected] =
    useState<ReceiveMaterial | undefined>();

  const filtered = useMemo(() => {

    if (!search.trim())
      return items;

    const s = search.toLowerCase();

    return items.filter((x) =>
      x.receiptNo.toLowerCase().includes(s) ||
      x.poNo.toLowerCase().includes(s) ||
      x.itemCode.toLowerCase().includes(s) ||
      x.itemName.toLowerCase().includes(s) ||
      x.supplier.toLowerCase().includes(s) ||
      x.warehouse.toLowerCase().includes(s)
    );

  }, [items, search]);

  function handleNew() {

    setSelected(undefined);

    setDialogOpen(true);

  }

  function handleEdit(
    item: ReceiveMaterial
  ) {

    setSelected(item);

    setDialogOpen(true);

  }

  function handleDelete(
    id: number
  ) {

    remove(id);

  }

  function handleSave(
    item: ReceiveMaterial
  ) {

    if (selected)

      update(item);

    else

      create(item);

  }

  return (

    <CRUDPage

      title="Receive Material"

      subtitle="Warehouse Receive Management"

      search={search}

      onSearchChange={setSearch}

      addLabel="New Receive"

      searchPlaceholder="Search Receive..."

      onAdd={handleNew}

    >

      <ReceiveKPIs
        items={filtered}
      />

      <ReceiveTable

        rows={filtered}

        loading={loading}

        onEdit={handleEdit}

        onDelete={handleDelete}

      />

      <ReceiveDialog

        open={dialogOpen}

        onClose={() => setDialogOpen(false)}

        onSave={handleSave}

        receive={selected}

      />

    </CRUDPage>

  );

}