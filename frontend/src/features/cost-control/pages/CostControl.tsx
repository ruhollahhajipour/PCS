import { useEffect, useState } from "react";

import CRUDPage from "../../../components/Common/CRUD/CRUDPage";

import CostControlTable from "./CostControlTable";
import CostControlDialog from "../dialogs/CostControlDialog";

import CostControlService from "../services/costControl.service";

import type { CostControl } from "../../../models/costControl";

export default function CostControlPage() {
  const [rows, setRows] = useState<CostControl[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data =
      await CostControlService.getAll();

    setRows(data);
  }

  const filteredRows = rows.filter((x) =>
    (
      x.wbs +
      x.costCode +
      x.discipline +
      x.description +
      x.period
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <CRUDPage
        title="Cost Control"
        subtitle="Project Cost Monitoring"
        search={search}
        onSearchChange={setSearch}
        addLabel="New Cost Item"
        searchPlaceholder="Search Cost..."
        onAdd={() =>
          setDialogOpen(true)
        }
      >
        <CostControlTable
          rows={filteredRows}
          onView={(r) =>
            console.log("VIEW", r)
          }
          onEdit={(r) =>
            console.log("EDIT", r)
          }
          onDelete={async (r) => {
            await CostControlService.delete(
              r.id
            );

            loadData();
          }}
        />
      </CRUDPage>

      <CostControlDialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        onSaved={loadData}
      />
    </>
  );
}