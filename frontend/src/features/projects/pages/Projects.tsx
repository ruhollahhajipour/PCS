import { useEffect, useState } from "react";

import CRUDPage from "../../../components/Common/CRUD/CRUDPage";

import ProjectTable from "./ProjectTable";
import ProjectDialog from "../dialogs/ProjectDialog";

import ProjectService from "../services/project.service";

import type { Project } from "../../../models/project";

export default function Projects() {
  const [rows, setRows] = useState<Project[]>([]);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const data = await ProjectService.getAll();

    setRows(data);
  }

  const filteredRows = rows.filter((x) =>
    (
      x.code +
      x.shortName +
      x.name +
      x.description
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <CRUDPage
        title="Projects"
        subtitle="Project Management"
        search={search}
        onSearchChange={setSearch}
        addLabel="New Project"
        searchPlaceholder="Search Project..."
        onAdd={() => setDialogOpen(true)}
      >
        <ProjectTable
          rows={filteredRows}
          onView={(r) =>
            console.log("VIEW", r)
          }
          onEdit={(r) =>
            console.log("EDIT", r)
          }
          onDelete={async (r) => {
            await ProjectService.delete(r.id);

            loadProjects();
          }}
        />
      </CRUDPage>

      <ProjectDialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        onSaved={loadProjects}
      />
    </>
  );
}