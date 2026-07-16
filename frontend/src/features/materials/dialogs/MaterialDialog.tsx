import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import MaterialService from "../services/material.service";
const initialForm = {
  id: 0,

  warehouseId: 1,

  code: "",
  shortName: "",
  name: "",

  category: "",

  unit: "PCS",

  specification: "",

  manufacturer: "",

  partNumber: "",

  minStock: 0,

  maxStock: 0,

  currentStock: 0,

  unitPrice: 0,

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

export default function MaterialDialog({
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
      [e.target.name as string]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await MaterialService.create({
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
      title="New Material"
      width="lg"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Code"
              name="code"
              value={form.code}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Short Name"
              name="shortName"
              value={form.shortName}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleText}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Material Name"
              name="name"
              value={form.name}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Specification"
              name="specification"
              value={form.specification}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Manufacturer"
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Part Number"
              name="partNumber"
              value={form.partNumber}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Min Stock"
              name="minStock"
              type="number"
              value={form.minStock}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Max Stock"
              name="maxStock"
              type="number"
              value={form.maxStock}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Current Stock"
              name="currentStock"
              type="number"
              value={form.currentStock}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Unit Price"
              name="unitPrice"
              type="number"
              value={form.unitPrice}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSSelect
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleSelect}
              options={[
                { value: "PCS", label: "PCS" },
                { value: "KG", label: "KG" },
                { value: "M", label: "M" },
                { value: "SET", label: "SET" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
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

          <Grid size={{ xs: 12, md: 3 }}>
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