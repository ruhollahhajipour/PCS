import { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import type { Plant } from "../types/plant";

const initialForm: Plant = {
  id: 0,

  code: "",

  name: "",

  companyId: 1,

  country: "",

  city: "",

  area: "",

  manager: "",

  phone: "",

  description: "",

  status: "Active",

  createdAt: "",

  updatedAt: "",
};

type Props = {
  open: boolean;
  plant: Plant | null;
  onClose: () => void;
  onSave: (plant: Plant) => Promise<void>;
};

export default function PlantDialog({
  open,
  plant,
  onClose,
  onSave,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<Plant>(initialForm);

  useEffect(() => {
    if (!open) return;

    if (plant)
      setForm(plant);
    else
      setForm(initialForm);
  }, [plant, open]);

  function change(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await onSave({
      ...form,

      id:
        form.id ||
        Date.now(),

      createdAt:
        form.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    });

    setLoading(false);

    onClose();
  }

  return (
    <PCSDialog
      open={open}
      width="md"
      title={
        plant
          ? "Edit Plant"
          : "New Plant"
      }
      onClose={onClose}
    >
      <form onSubmit={submit}>

        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Code"
              name="code"
              value={form.code}
              onChange={change}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <PCSTextField
              label="Plant Name"
              name="name"
              value={form.name}
              onChange={change}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Country"
              name="country"
              value={form.country}
              onChange={change}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="City"
              name="city"
              value={form.city}
              onChange={change}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Area"
              name="area"
              value={form.area}
              onChange={change}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Manager"
              name="manager"
              value={form.manager}
              onChange={change}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={change}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Description"
              name="description"
              value={form.description}
              onChange={change}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status:
                    e.target.value as Plant["status"],
                })
              }
              options={[
                {
                  value: "Active",
                  label: "Active",
                },
                {
                  value: "Inactive",
                  label: "Inactive",
                },
              ]}
            />
          </Grid>

        </Grid>

        <PCSFormActions
          loading={loading}
          onCancel={onClose}
        />

      </form>
    </PCSDialog>
  );
}