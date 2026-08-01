import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import type { Procurement } from "../types/procurement";

const initialForm: Procurement = {
  id: 0,

  prNo: "",
  poNo: "",

  project: "",
  vendor: "",

  itemCode: "",

  description: "",

  discipline: "",
  buyer: "",

  quantity: 0,
  unit: "",

  unitPrice: 0,
  totalPrice: 0,

  currency: "USD",

  requestedDate: "",
  requiredDate: "",
  deliveryDate: "",

  status: "Draft",

  progress: 0,

  remarks: "",

  createdAt: "",
  updatedAt: "",
};

type Props = {
  open: boolean;

  procurement: Procurement | null;

  onClose: () => void;

  onSave: (
    procurement: Procurement
  ) => Promise<void>;
};

export default function ProcurementDialog({
  open,
  procurement,
  onClose,
  onSave,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<Procurement>(initialForm);

  useEffect(() => {
    if (!open) return;

    if (procurement) {
      setForm(procurement);
    } else {
      setForm(initialForm);
    }
  }, [procurement, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      next.totalPrice =
        Number(next.quantity) *
        Number(next.unitPrice);

      return next;
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
      procurement
        ? "Edit Procurement"
        : "New Procurement"
    }
    onClose={onClose}
  >
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 4 }}>
          <PCSTextField
            label="PR No"
            name="prNo"
            value={form.prNo}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PCSTextField
            label="PO No"
            name="poNo"
            value={form.poNo}
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
                status: e.target.value as Procurement["status"],
              })
            }
            options={[
              { value: "Draft", label: "Draft" },
              { value: "RFQ", label: "RFQ" },
              { value: "Quoted", label: "Quoted" },
              { value: "PO", label: "PO" },
              { value: "Delivered", label: "Delivered" },
              { value: "Closed", label: "Closed" },
              { value: "Cancelled", label: "Cancelled" },
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
            label="Vendor"
            name="vendor"
            value={form.vendor}
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
          <PCSTextField
            label="Item Code"
            name="itemCode"
            value={form.itemCode}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PCSTextField
            label="Discipline"
            name="discipline"
            value={form.discipline}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PCSTextField
            label="Buyer"
            name="buyer"
            value={form.buyer}
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
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PCSTextField
            label="Unit Price"
            name="unitPrice"
            value={String(form.unitPrice)}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PCSTextField
            label="Total Price"
            name="totalPrice"
            value={String(form.totalPrice)}
            onChange={() => {}}
            disabled
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PCSTextField
            label="Requested Date"
            name="requestedDate"
            value={form.requestedDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PCSTextField
            label="Required Date"
            name="requiredDate"
            value={form.requiredDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <PCSTextField
            label="Delivery Date"
            name="deliveryDate"
            value={form.deliveryDate}
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

        <Grid size={{ xs: 12, md: 8 }}>
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
);}