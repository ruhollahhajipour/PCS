import { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import type { Company } from "../types/company";

const initialForm: Company = {
  id: 0,
  code: "",
  name: "",
  shortName: "",
  logo: "",
  country: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  description: "",
  status: "Active",
  createdAt: "",
  updatedAt: "",
};

type Props = {
  open: boolean;
  company: Company | null;
  onClose: () => void;
  onSave: (company: Company) => Promise<void>;
};

export default function CompanyDialog({
  open,
  company,
  onClose,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] =
    useState<Company>(initialForm);

  useEffect(() => {
    if (!open) return;

    if (company) {
      setForm(company);
    } else {
      setForm(initialForm);
    }
  }, [company, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    await onSave({
      ...form,
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
      title={
        company
          ? "Edit Company"
          : "New Company"
      }
      width="md"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Code"
              name="code"
              value={form.code}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <PCSTextField
              label="Company Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Short Name"
              name="shortName"
              value={form.shortName}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Website"
              name="website"
              value={form.website}
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

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as
                    | "Active"
                    | "Inactive",
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