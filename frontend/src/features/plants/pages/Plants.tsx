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

import PlantToolbar from "../components/PlantToolbar";
import PlantDialog from "../dialogs/PlantDialog";

import usePlants from "../hooks/usePlants";

import type { Plant } from "../types/plant";

export default function Plants() {
  const {
    plants,
    loading,
    create,
    update,
    remove,
    reload,
  } = usePlants();

  const [search, setSearch] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [selectedPlant, setSelectedPlant] =
    useState<Plant | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return plants.filter((x) => {
      return (
        x.code.toLowerCase().includes(q) ||
        x.name.toLowerCase().includes(q) ||
        x.country.toLowerCase().includes(q) ||
        x.city.toLowerCase().includes(q) ||
        x.manager.toLowerCase().includes(q)
      );
    });
  }, [plants, search]);

  async function handleSave(
    plant: Plant
  ) {
    if (selectedPlant)
      await update(plant);
    else
      await create(plant);

    setSelectedPlant(null);

    setOpen(false);
  }

  async function handleDelete() {
    if (deleteId == null) return;

    await remove(deleteId);

    setDeleteOpen(false);

    setDeleteId(null);
  }

  return (
    <Box>

      <PlantToolbar
        search={search}
        onSearch={setSearch}
        onRefresh={reload}
        onNew={() => {
          setSelectedPlant(null);
          setOpen(true);
        }}
      />

      <Paper
        sx={{
          borderRadius: 5,
          overflow: "hidden",
        }}
      >

        <PCSDataGrid
          rows={filtered}
          loading={loading}
          columns={[

            {
              field: "code",
              headerName: "Code",
              flex: 1,
            },

            {
              field: "name",
              headerName: "Plant",
              flex: 2,
            },

            {
              field: "country",
              headerName: "Country",
              flex: 1,
            },

            {
              field: "city",
              headerName: "City",
              flex: 1,
            },

            {
              field: "area",
              headerName: "Area",
              flex: 1,
            },

            {
              field: "manager",
              headerName: "Manager",
              flex: 1.5,
            },

            {
              field: "phone",
              headerName: "Phone",
              flex: 1.3,
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
                    <IconButton
                      color="primary"
                    >
                      <VisibilityRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      color="warning"
                      onClick={() => {
                        setSelectedPlant(
                          params.row
                        );

                        setOpen(true);
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

      <PlantDialog
        open={open}
        plant={selectedPlant}
        onClose={() => {
          setOpen(false);
          setSelectedPlant(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Plant"
        message="Are you sure you want to delete this plant?"
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
      />

    </Box>
  );
}