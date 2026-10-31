import { useEffect, useState } from "react";

import CRUDPage from "../../../components/Common/CRUD/CRUDPage";

import VendorTable from "./VendorTable";
import VendorDialog from "../dialogs/VendorDialog";

import VendorService from "../services/vendor.service";

import type { Vendor } from "../../../models/vendor";

export default function Vendors() {
  const [rows, setRows] = useState<Vendor[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data =
      await VendorService.getAll();

    setRows(data);
  }

  const filteredRows = rows.filter((x) =>
    (
      x.code +
      x.shortName +
      x.name +
      x.country +
      x.city +
      x.contactPerson +
      x.email
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <CRUDPage
        title="Vendors"
        subtitle="Vendor Management"
        search={search}
        onSearchChange={setSearch}
        addLabel="New Vendor"
        searchPlaceholder="Search Vendor..."
        onAdd={() =>
          setDialogOpen(true)
        }
      >
        <VendorTable
          rows={filteredRows}
          onView={(r) =>
            console.log("VIEW", r)
          }
          onEdit={(r) =>
            console.log("EDIT", r)
          }
          onDelete={async (r) => {
            await VendorService.delete(
              r.id
            );

            loadData();
          }}
        />
      </CRUDPage>

      <VendorDialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        onSaved={loadData}
      />
    </>
  );
}