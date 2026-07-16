import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import CostControlService from "../services/costControl.service";

const initialForm = {
  id: 0,code: "",

  projectId: 1,

  wbs: "",

  costCode: "",

  discipline: "",

  description: "",

  budget: 0,

  committed: 0,

  actual: 0,

  forecast: 0,

  remaining: 0,

  variance: 0,

  currency: "USD",

  period: "",

  status: "Active" as "Active" | "Inactive",

  createdAt: "",

  updatedAt: "",
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function CostControlDialog({
  open,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  function handleText(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  }

  function handleSelect(
    e: SelectChangeEvent
  ) {
    setForm({
      ...form,
      [e.target.name as string]:
        e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await CostControlService.create({
      ...form,
      id: Date.now(),
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
      title="Cost Control Item"
      width="lg"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="WBS"
              name="wbs"
              value={form.wbs}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Cost Code"
              name="costCode"
              value={form.costCode}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Discipline"
              name="discipline"
              value={form.discipline}
              onChange={handleText}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Description"
              name="description"
              value={form.description}
              multiline
              rows={3}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Budget"
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Committed"
              name="committed"
              type="number"
              value={form.committed}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Actual"
              name="actual"
              type="number"
              value={form.actual}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Forecast"
              name="forecast"
              type="number"
              value={form.forecast}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Remaining"
              name="remaining"
              type="number"
              value={form.remaining}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Variance"
              name="variance"
              type="number"
              value={form.variance}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Period"
              name="period"
              value={form.period}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSSelect
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleSelect}
              options={[
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
                { value: "IRR", label: "IRR" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={handleSelect}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
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