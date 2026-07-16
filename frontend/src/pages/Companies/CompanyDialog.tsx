import { useState } from "react";

import {
  Grid,
  type SelectChangeEvent,
} from "@mui/material";

import PCSDialog from "../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../components/Common/Form/PCSTextField";
import PCSSelect from "../../components/Common/Form/PCSSelect";

type CompanyDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function CompanyDialog({
  open,
  onClose,
}: CompanyDialogProps) {
  const [loading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    shortName: "",
    name: "",
    country: "",
    city: "",
    address: "",
    currency: "USD",
    status: "Active",
    registrationNumber: "",
    taxNumber: "",
  });

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (
    e: SelectChangeEvent
  ) => {
    setForm({
      ...form,
      [e.target.name as string]: e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log(form);

    onClose();
  };

  return (
    <PCSDialog
      open={open}
      title="New Company"
      width="md"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Code"
              name="code"
              value={form.code}
              required
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Short Name"
              name="shortName"
              value={form.shortName}
              required
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Company Name"
              name="name"
              value={form.name}
              required
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSSelect
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleSelectChange}
              options={[
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
                { value: "IRR", label: "IRR" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={handleSelectChange}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Registration Number"
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Tax Number"
              name="taxNumber"
              value={form.taxNumber}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Address"
              name="address"
              value={form.address}
              multiline
              rows={4}
              onChange={handleTextChange}
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