import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import VendorService from "../services/vendor.service";

const initialForm = {
  id: 0,

  code: "",
  shortName: "",
  name: "",

  country: "",
  city: "",
  address: "",

  contactPerson: "",

  phone: "",

  email: "",

  website: "",

  registrationNumber: "",

  taxNumber: "",

  currency: "USD",

  paymentTerm: "30 Days",

  rating: 5,

  status: "Active" as "Active" | "Inactive",

  createdAt: "",
  updatedAt: "",
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function VendorDialog({
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

    await VendorService.create({
      ...form,
      id:Date.now().toString(),
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
      title="New Vendor"
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
              label="Vendor Name"
              name="name"
              value={form.name}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleText}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Address"
              name="address"
              value={form.address}
              multiline
              rows={3}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Contact Person"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Website"
              name="website"
              value={form.website}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Registration Number"
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Tax Number"
              name="taxNumber"
              value={form.taxNumber}
              onChange={handleText}
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
            <PCSTextField
              label="Rating"
              name="rating"
              type="number"
              value={form.rating}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Payment Term"
              name="paymentTerm"
              value={form.paymentTerm}
              onChange={handleText}
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