import { useMemo, useState } from "react";

import {
  Box,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";

import VisibilityRoundedIcon
  from "@mui/icons-material/VisibilityRounded";

import EditRoundedIcon
  from "@mui/icons-material/EditRounded";

import DeleteRoundedIcon
  from "@mui/icons-material/DeleteRounded";

import type {
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import PCSDataGrid
  from "../../../components/Common/PCSDataGrid/PCSDataGrid";

import StatusChip
  from "../../../components/Common/StatusChip";

import ConfirmDialog
  from "../../../components/Common/Dialog/ConfirmDialog";

import PlantToolbar
  from "../components/PlantToolbar";

import PlantDialog
  from "../dialogs/PlantDialog";

import usePlants
  from "../hooks/usePlants";

import type { Plant }
  from "../types/plant";


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
    useState<string | null>(null);


  const filtered = useMemo(() => {
    const q =
      search.trim().toLowerCase();

    if (!q) {
      return plants;
    }

    return plants.filter((plant) => {
      return [
        plant.code,
        plant.name,
        plant.shortName,
        plant.address,
        plant.phone,
        plant.email,
        plant.description,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(q)
        );
    });
  }, [plants, search]);


  function handleNew() {
    setSelectedPlant(null);
    setOpen(true);
  }


  function handleEdit(
    plant: Plant
  ) {
    setSelectedPlant(plant);
    setOpen(true);
  }


  async function handleSave(
    plant: Plant
  ) {
    if (selectedPlant) {
      await update(plant);
    } else {
      await create(plant);
    }

    setSelectedPlant(null);
    setOpen(false);
  }


  function handleDeleteRequest(
    plant: Plant
  ) {
    setDeleteId(plant.id);
    setDeleteOpen(true);
  }


  async function handleDelete() {
    if (!deleteId) {
      return;
    }

    await remove(deleteId);

    setDeleteOpen(false);
    setDeleteId(null);
  }


  function handleView(
    plant: Plant
  ) {
    setSelectedPlant(plant);
    setOpen(true);
  }


  const columns: GridColDef<Plant>[] = [
    {
      field: "code",
      headerName: "Code",
      width: 130,
    },

    {
      field: "name",
      headerName: "Plant",
      flex: 2,
      minWidth: 260,
    },

    {
      field: "shortName",
      headerName: "Short Name",
      flex: 1,
      minWidth: 130,
      valueGetter: (
        _value,
        row
      ) => row.shortName ?? "",
    },

    {
      field: "address",
      headerName: "Address",
      flex: 2,
      minWidth: 220,
      valueGetter: (
        _value,
        row
      ) => row.address ?? "",
    },

    {
      field: "phone",
      headerName: "Phone",
      flex: 1.2,
      minWidth: 150,
      valueGetter: (
        _value,
        row
      ) => row.phone ?? "",
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 190,
      valueGetter: (
        _value,
        row
      ) => row.email ?? "",
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 125,
      sortable: true,
      renderCell: (
        params: GridRenderCellParams<Plant>
      ) => (
        <StatusChip
          value={
            params.row.isActive
              ? "Active"
              : "Inactive"
          }
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (
        params: GridRenderCellParams<Plant>
      ) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Tooltip title="View">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                handleView(params.row)
              }
            >
              <VisibilityRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="warning"
              onClick={() =>
                handleEdit(params.row)
              }
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                handleDeleteRequest(
                  params.row
                )
              }
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];


  return (
    <Box>
      <PlantToolbar
        search={search}
        onSearch={setSearch}
        onRefresh={reload}
        onNew={handleNew}
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <PCSDataGrid
          rows={filtered}
          loading={loading}
          columns={columns}
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