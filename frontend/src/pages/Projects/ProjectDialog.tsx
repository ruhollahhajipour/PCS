import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import PCSDialog from "../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../components/Common/Form/PCSTextField";
import PCSSelect from "../../components/Common/Form/PCSSelect";

import ProjectService from "../../services/project.service";

const initialForm = {
  id: 0,
  plantId: 1,

  code: "",
  shortName: "",
  name: "",

  description: "",

  startDate: "",
  finishDate: "",

  budget: 0,

  currency: "USD",

  status: "Active" as "Active" | "Inactive",

  createdAt: "",
  updatedAt: "",
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function ProjectDialog({
  open,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  const handleText = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (
    e: SelectChangeEvent
  ) => {
    setForm({
      ...form,
      [e.target.name as string]: e.target.value,
    });
  };

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await ProjectService.create({
      ...form,

      id: Date.now(),

      budget: Number(form.budget),

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    });

    setLoading(false);

    onSaved();

    onClose();
  }

  return (
    <PCSDialog
      open={open}
      title="New Project"
      width="md"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          <Grid size={{ xs:12, md:6 }}>
            <PCSTextField
              label="Code"
              name="code"
              value={form.code}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs:12, md:6 }}>
            <PCSTextField
              label="Short Name"
              name="shortName"
              value={form.shortName}
              onChange={handleText}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Project Name"
              name="name"
              value={form.name}
              onChange={handleText}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Description"
              name="description"
              multiline
              rows={3}
              value={form.description}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs:12, md:6 }}>
            <PCSTextField
              label="Start Date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs:12, md:6 }}>
            <PCSTextField
              label="Finish Date"
              name="finishDate"
              type="date"
              value={form.finishDate}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs:12, md:6 }}>
            <PCSTextField
              label="Budget"
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs:12, md:6 }}>
            <PCSSelect
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleSelect}
              options={[
                { value:"USD",label:"USD"},
                { value:"EUR",label:"EUR"},
                { value:"IRR",label:"IRR"},
              ]}
            />
          </Grid>

          <Grid size={{ xs:12, md:6 }}>
            <PCSSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={handleSelect}
              options={[
                { value:"Active",label:"Active"},
                { value:"Inactive",label:"Inactive"},
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