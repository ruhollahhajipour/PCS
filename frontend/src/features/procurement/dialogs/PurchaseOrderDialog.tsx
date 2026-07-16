import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import PurchaseOrderService from "../../../services/purchaseOrder.service";

const initialForm = {
  id: 0,

  code: "",

  projectId: 1,
  vendorId: 1,

  poNumber: "",

  title: "",

  description: "",

  orderDate: "",

  deliveryDate: "",

  currency: "USD",

  totalAmount: 0,

  approvedAmount: 0,

  receivedAmount: 0,

  status: "Draft" as
    | "Draft"
    | "Pending"
    | "Approved"
    | "Closed"
    | "Cancelled",

  createdAt: "",
  updatedAt: "",
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function PurchaseOrderDialog({
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

    await PurchaseOrderService.create({
      ...form,

      id: Date.now(),

      code: form.poNumber,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    });

    setLoading(false);

    onSaved();

    onClose();
  }

  return (
    <PCSDialog
      open={open}
      title="New Purchase Order"
      width="lg"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="PO Number"
              name="poNumber"
              value={form.poNumber}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <PCSTextField
              label="Title"
              name="title"
              value={form.title}
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

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Order Date"
              name="orderDate"
              type="date"
              value={form.orderDate}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Delivery Date"
              name="deliveryDate"
              type="date"
              value={form.deliveryDate}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Total Amount"
              name="totalAmount"
              type="number"
              value={form.totalAmount}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Approved Amount"
              name="approvedAmount"
              type="number"
              value={form.approvedAmount}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Received Amount"
              name="receivedAmount"
              type="number"
              value={form.receivedAmount}
              onChange={handleText}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSSelect
              label="Status"
              name="status"
              value={form.status}
              onChange={handleSelect}
              options={[
                { value: "Draft", label: "Draft" },
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Closed", label: "Closed" },
                { value: "Cancelled", label: "Cancelled" },
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