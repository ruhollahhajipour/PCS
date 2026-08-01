import { useEffect, useState } from "react";

import {
  Grid,
} from "@mui/material";

import PCSDialog from "../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../components/Common/Form/PCSSelect";

import type { WarehouseItem } from "../types/warehouse";

const initialForm: WarehouseItem = {
  id: 0,

  itemCode: "",
  itemName: "",
  category: "",

  warehouse: "",
  location: "",
  bin: "",

  unit: "",

  quantity: 0,
  minimumStock: 0,
  maximumStock: 0,

  unitPrice: 0,
  totalPrice: 0,

  currency: "USD",

  supplier: "",

  receivedDate: "",
  expiryDate: "",

  status: "Available",

  remarks: "",

  createdAt: "",
  updatedAt: "",
};

type Props = {
  open: boolean;

  item: WarehouseItem | null;

  onClose: () => void;

  onSave: (
    item: WarehouseItem
  ) => Promise<void>;
};

export default function WarehouseDialog({
  open,
  item,
  onClose,
  onSave,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<WarehouseItem>(initialForm);

  useEffect(() => {

    if (!open) return;

    if (item) {

      setForm(item);

    } else {

      setForm(initialForm);

    }

  }, [item, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const value = e.target.value;

    const name = e.target.name;

    setForm(prev => {

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
      width="lg"
      title={
        item
          ? "Edit Warehouse Item"
          : "New Warehouse Item"
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Supplier"
              name="supplier"
              value={form.supplier}
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
            <PCSTextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Bin"
              name="bin"
              value={form.bin}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Quantity"
              name="quantity"
              value={String(form.quantity)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Min Stock"
              name="minimumStock"
              value={String(form.minimumStock)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <PCSTextField
              label="Max Stock"
              name="maximumStock"
              value={String(form.maximumStock)}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Unit Price"
              name="unitPrice"
              value={String(form.unitPrice)}
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

          <Grid size={{ xs: 12, md: 4 }}>
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
              label="Received Date"
              name="receivedDate"
              value={form.receivedDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Expiry Date"
              name="expiryDate"
              value={form.expiryDate}
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
                  status:
                    e.target.value as WarehouseItem["status"],
                })
              }
              options={[
                { value: "Available", label: "Available" },
                { value: "Reserved", label: "Reserved" },
                { value: "Issued", label: "Issued" },
                { value: "Damaged", label: "Damaged" },
                { value: "Returned", label: "Returned" },
              ]}
            />
          </Grid>

          <Grid size={12}>
            <PCSTextField
              label="Remarks"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
            />
          </Grid>        </Grid>

        <PCSFormActions
          loading={loading}
          onCancel={onClose}
        />

      </form>
    </PCSDialog>
  );
}