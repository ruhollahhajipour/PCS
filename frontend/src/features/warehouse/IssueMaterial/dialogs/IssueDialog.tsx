import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import PCSDialog from "../../../../components/Common/Form/PCSDialog";
import PCSTextField from "../../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../../components/Common/Form/PCSSelect";
import PCSFormActions from "../../../../components/Common/Form/PCSFormActions";

import type { Issue } from "../types/issue";

type Props = {
  open: boolean;
  issue: Issue | null;
  onClose: () => void;
  onSave: (item: Issue) => Promise<void>;
};

const emptyIssue: Issue = {
  id: 0,
  issueNo: "",
  warehouse: "",
  project: "",
  itemCode: "",
  itemName: "",
  category: "",
  quantity: 0,
  unit: "",
  requestedBy: "",
  approvedBy: "",
  receiver: "",
  purpose: "",
  issueDate: "",
  status: "Pending",
  remarks: "",
  createdAt: "",
  updatedAt: "",
};

export default function IssueDialog({
  open,
  issue,
  onClose,
  onSave,
}: Props) {

  const [form, setForm] =
    useState<Issue>(emptyIssue);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (issue)
      setForm(issue);
    else
      setForm(emptyIssue);

  }, [issue]);

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
      id: form.id || Date.now(),
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
        issue
          ? "Edit Issue"
          : "New Issue"
      }
      width="lg"
      onClose={onClose}
    >

      <form onSubmit={handleSubmit}>

        <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Issue No"
              name="issueNo"
              value={form.issueNo}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Warehouse"
              name="warehouse"
              value={form.warehouse}
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
                  status: e.target.value as Issue["status"],
                })
              }
              options={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Project"
              name="project"
              value={form.project}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Item Code"
              name="itemCode"
              value={form.itemCode}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <PCSTextField
              label="Item Name"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Quantity"
              name="quantity"
              value={String(form.quantity)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Issue Date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Requested By"
              name="requestedBy"
              value={form.requestedBy}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Approved By"
              name="approvedBy"
              value={form.approvedBy}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Receiver"
              name="receiver"
              value={form.receiver}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Purpose"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Remarks"
              name="remarks"
              value={form.remarks}
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