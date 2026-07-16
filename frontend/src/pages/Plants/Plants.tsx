import { useEffect, useState } from "react";

import CRUDPage from "../../components/Common/CRUD/CRUDPage";

import PlantTable from "./PlantTable";
import PlantDialog from "./PlantDialog";

import PlantService from "../../services/plant.service";

import type { Plant } from "../../models/plant";

export default function Plants() {
  const [rows, setRows] = useState<Plant[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  useEffect(() => {
    loadPlants();
  }, []);

  async function loadPlants() {
    const data = await PlantService.getAll();

    setRows(data);
  }

  const filteredRows = rows.filter((x) =>
    (
      x.code +
      x.shortName +
      x.name +
      x.city +
      x.country
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <CRUDPage
        title="Plants"
        subtitle="Plant Management"

        search={search}

        onSearchChange={setSearch}

        addLabel="New Plant"

        searchPlaceholder="Search Plant..."

        onAdd={() => setDialogOpen(true)}
      >
        <PlantTable
          rows={filteredRows}
          onView={(r) =>
            console.log("VIEW", r)
          }
          onEdit={(r) =>
            console.log("EDIT", r)
          }
          onDelete={async (r) => {
            await PlantService.delete(r.id);

            loadPlants();
          }}
        />
      </CRUDPage>

      <PlantDialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        onSaved={loadPlants}
      />
    </>
  );
}