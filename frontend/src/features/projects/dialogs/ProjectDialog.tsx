import { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import type { Project } from "../types/project";

const initialForm: Project = {
  id: 0,

  code: "",

  name: "",

  companyId: 1,

  plantId: 1,

  contractNo: "",

  client: "",

  contractor: "",

  consultant: "",

  budget: 0,

  actualCost: 0,

  progress: 0,

  spi: 1,

  cpi: 1,

  startDate: "",

  finishDate: "",

  description: "",

  status: "Active",

  createdAt: "",

  updatedAt: "",
};

type Props = {
  open: boolean;

  project: Project | null;

  onClose: () => void;

  onSave: (
    project: Project
  ) => Promise<void>;
};

export default function ProjectDialog({
  open,
  project,
  onClose,
  onSave,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<Project>(initialForm);

  useEffect(() => {
    if (!open) return;

    if (project)
      setForm(project);
    else
      setForm(initialForm);
  }, [project, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "budget" ||
        name === "actualCost" ||
        name === "progress" ||
        name === "spi" ||
        name === "cpi"
          ? Number(value)
          : value,
    });
  }

  async function handleSubmit(
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
      width="lg"
      title={
        project
          ? "Edit Project"
          : "New Project"
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>

        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Code"
              name="code"
              value={form.code}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <PCSTextField
              label="Project Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Client"
              name="client"
              value={form.client}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Contractor"
              name="contractor"
              value={form.contractor}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Consultant"
              name="consultant"
              value={form.consultant}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Contract No"
              name="contractNo"
              value={form.contractNo}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Budget"
              name="budget"
              value={String(form.budget)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Actual Cost"
              name="actualCost"
              value={String(form.actualCost)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Progress %"
              name="progress"
              value={String(form.progress)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="SPI"
              name="spi"
              value={String(form.spi)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="CPI"
              name="cpi"
              value={String(form.cpi)}
              onChange={handleChange}
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
                    e.target
                      .value as Project["status"],
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
                {
                  value: "Completed",
                  label: "Completed",
                },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Start Date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Finish Date"
              name="finishDate"
              value={form.finishDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
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