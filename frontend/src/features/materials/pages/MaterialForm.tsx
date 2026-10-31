import { Grid } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import type { Material } from "../../../models/material";

type Props = {
  form: Material;
  onText: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSelect: (
    e: SelectChangeEvent
  ) => void;
};

export default function MaterialForm({
  form,
  onText,
  onSelect,
}: Props) {
  return (
    <Grid container spacing={2}>

      <Grid size={{ xs: 12, md: 4 }}>
        <PCSTextField
          label="Code"
          name="code"
          value={form.code}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <PCSTextField
          label="Short Name"
          name="shortName"
          value={form.shortName}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <PCSTextField
          label="Category"
          name="category"
          value={form.category}
          onChange={onText}
        />
      </Grid>

      <Grid size={12}>
        <PCSTextField
          label="Material Name"
          name="name"
          value={form.name}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <PCSTextField
          label="Specification"
          name="specification"
          value={form.specification}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <PCSTextField
          label="Manufacturer"
          name="manufacturer"
          value={form.manufacturer}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <PCSTextField
          label="Part Number"
          name="partNumber"
          value={form.partNumber}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <PCSTextField
          label="Min Stock"
          name="minStock"
          type="number"
          value={form.minStock}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <PCSTextField
          label="Max Stock"
          name="maxStock"
          type="number"
          value={form.maxStock}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <PCSTextField
          label="Current Stock"
          name="currentStock"
          type="number"
          value={form.currentStock}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <PCSTextField
          label="Unit Price"
          name="unitPrice"
          type="number"
          value={form.unitPrice}
          onChange={onText}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <PCSSelect
          label="Unit"
          name="unit"
          value={form.unit}
          onChange={onSelect}
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
          onChange={onSelect}
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
          onChange={onSelect}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />
      </Grid>

    </Grid>
  );
}