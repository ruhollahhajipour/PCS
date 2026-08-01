import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import PCSDialog from "../../../../components/Common/Form/PCSDialog";
import PCSFormActions from "../../../../components/Common/Form/PCSFormActions";
import PCSTextField from "../../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../../components/Common/Form/PCSSelect";

import type { Receipt } from "../types/receipt";

const initialForm: Receipt = {

  id: 0,

  receiptNo: "",

  poNo: "",

  supplier: "",

  warehouse: "",

  location: "",

  itemCode: "",

  itemName: "",

  category: "",

  quantity: 0,

  unit: "",

  receiveDate: "",

  inspector: "",

  documentNo: "",

  remarks: "",

  status: "Pending",

  createdAt: "",

  updatedAt: "",

};

type Props = {

  open: boolean;

  receipt: Receipt | null;

  onClose: () => void;

  onSave: (
    receipt: Receipt
  ) => Promise<void>;

};

export default function ReceiptDialog({

  open,

  receipt,

  onClose,

  onSave,

}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<Receipt>(initialForm);

  useEffect(() => {

    if (!open) return;

    if (receipt) {

      setForm(receipt);

    } else {

      setForm(initialForm);

    }

  }, [receipt, open]);

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

        receipt

          ? "Edit Receipt"

          : "New Receipt"

      }

      onClose={onClose}

    >

      <form onSubmit={handleSubmit}>

<Grid container spacing={2}>

                  <Grid size={{ xs: 12, md: 4 }}>
            <PCSTextField
              label="Receipt No"
              name="receiptNo"
              value={form.receiptNo}
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
                  status: e.target.value as Receipt["status"],
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
              label="Supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Warehouse"
              name="warehouse"
              value={form.warehouse}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Location"
              name="location"
              value={form.location}
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
              label="Receive Date"
              name="receiveDate"
              value={form.receiveDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Inspector"
              name="inspector"
              value={form.inspector}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PCSTextField
              label="Document No"
              name="documentNo"
              value={form.documentNo}
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