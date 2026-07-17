import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import PCSDataGrid from "../../../components/Common/PCSDataGrid/PCSDataGrid";
import StatusChip from "../../../components/Common/StatusChip";
import ConfirmDialog from "../../../components/Common/Dialog/ConfirmDialog";

import ProjectToolbar from "../components/ProjectToolbar";
import ProjectDialog from "../dialogs/ProjectDialog";

import useProjects from "../hooks/useProjects";

import type { Project } from "../types/project";

export default function Projects() {
  const {
    projects,
    loading,
    create,
    update,
    remove,
    reload,
  } = useProjects();

  const [search, setSearch] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const rows = useMemo(() => {
    const q = search.toLowerCase();

    return projects.filter((x) => {
      return (
        x.code.toLowerCase().includes(q) ||
        x.name.toLowerCase().includes(q) ||
        x.client.toLowerCase().includes(q) ||
        x.contractor.toLowerCase().includes(q)
      );
    });
  }, [projects, search]);

  async function handleSave(
    project: Project
  ) {
    if (selectedProject)
      await update(project);
    else
      await create(project);

    setSelectedProject(null);

    setDialogOpen(false);
  }

  async function handleDelete() {
    if (deleteId == null) return;

    await remove(deleteId);

    setDeleteOpen(false);

    setDeleteId(null);
  }

  return (
    <Box>

      <ProjectToolbar
        search={search}
        onSearch={setSearch}
        onRefresh={reload}
        onNew={() => {
          setSelectedProject(null);
          setDialogOpen(true);
        }}
      />

      <Paper
        sx={{
          borderRadius: 5,
          overflow: "hidden",
        }}
      >

        <PCSDataGrid
          rows={rows}
          loading={loading}
          columns={[
            {
              field: "code",
              headerName: "Code",
              flex: 1,
            },

            {
              field: "name",
              headerName: "Project",
              flex: 2,
            },

            {
              field: "client",
              headerName: "Client",
              flex: 1.4,
            },

            {
              field: "budget",
              headerName: "Budget",
              flex: 1.2,
            },

            {
              field: "actualCost",
              headerName: "Actual",
              flex: 1.2,
            },

            {
              field: "progress",
              headerName: "%",
              flex: .7,
            },

            {
              field: "spi",
              headerName: "SPI",
              flex: .7,
            },

            {
              field: "cpi",
              headerName: "CPI",
              flex: .7,
            },

            {
              field: "status",
              headerName: "Status",
              flex: 1,

              renderCell: (params: any) => (
                <StatusChip
                  value={params.value}
                />
              ),
            },

            {
              field: "actions",

              headerName: "Actions",

              sortable: false,

              filterable: false,

              width: 170,

              renderCell: (params: any) => (
                <>

                  <Tooltip title="View">
                    <IconButton color="primary">
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      color="warning"
                      onClick={() => {
                        setSelectedProject(
                          params.row
                        );

                        setDialogOpen(true);
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteId(
                          params.row.id
                        );

                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Tooltip>

                </>
              ),
            },
          ]}
        />

      </Paper>

      <ProjectDialog
        open={dialogOpen}
        project={selectedProject}
        onClose={() => {
          setDialogOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
      />

    </Box>
  );
}