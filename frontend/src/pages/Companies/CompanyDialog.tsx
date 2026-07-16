import { useEffect, useState } from "react";

import { Grid, type SelectChangeEvent } from "@mui/material";

import PCSDialog from "../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../components/Common/Form/PCSTextField";
import PCSSelect from "../../components/Common/Form/PCSSelect";

import CompanyService from "../../services/company.service";

import type { Company } from "../../models/company";

type CompanyDialogProps = {
  open: boolean;
  company: Company | null;
  onClose: () => void;
  onSaved: () => void;
};

const emptyForm = {
  code: "",
  shortName: "",
  name: "",
  country: "",
  city: "",
  address: "",
  currency: "USD",
  status: "Active" as "Active" | "Inactive",
  registrationNumber: "",
  taxNumber: "",
};

export default function CompanyDialog({
  open,
  company,
  onClose,
  onSaved,
}: CompanyDialogProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (company) {
      setForm({
        code: company.code,
        shortName: company.shortName,
        name: company.name,
        country: company.country,
        city: company.city,
        address: company.address,
        currency: company.currency,
        status: company.status,
        registrationNumber: company.registrationNumber,
        taxNumber: company.taxNumber,
      });
    } else {
      setForm(emptyForm);
    }
  }, [company, open]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (
    e: SelectChangeEvent
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name as string]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    if (company) {
      await CompanyService.update({
        ...company,
        ...form,
      });
    } else {
      await CompanyService.create(form);
    }

    setLoading(false);

    onSaved();

    onClose();
  };
   return (
    <PCSDialog
      open={open}
      title={
        company ? "Edit Company" : "New Company"
      }
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
          saveText={
            company ? "Update" : "Save"
          }
          onCancel={onClose}
        />
      </form>
    </PCSDialog>
  );
}