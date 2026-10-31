import { useEffect, useState } from "react";
import CRUDPage from "../../../components/Common/CRUD/CRUDPage";

import MaterialTable from "./MaterialTable";
import MaterialDialog from "../dialogs/MaterialDialog";

import MaterialService from "../services/material.service";
import type { Material } from "../../../models/material";


export default function Materials() {
  const [rows, setRows] = useState<Material[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);


  async function loadData() {
    const data =
      await MaterialService.getAll();

    setRows(data);
  }

  const filteredRows = rows.filter((x) =>
    (
      x.code +
      x.shortName +
      x.name +
      x.category +
      x.manufacturer +
      x.partNumber
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <CRUDPage
        title="Materials"
        subtitle="Material Master Data"
        search={search}
        onSearchChange={setSearch}
        addLabel="New Material"
        searchPlaceholder="Search Material..."
        onAdd={() =>
          setDialogOpen(true)
        }
      >

        <MaterialTable
          rows={filteredRows}
          onView={(r) =>
            console.log("VIEW", r)
          }
          onEdit={(r) =>
            console.log("EDIT", r)
          }
          onDelete={async (r) => {
            await MaterialService.delete(
              r.id
            );

            loadData();
          }}
        />
      </CRUDPage>

      <MaterialDialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        onSaved={loadData}
      />
    </>
  );
}