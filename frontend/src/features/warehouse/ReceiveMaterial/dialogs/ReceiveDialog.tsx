import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import PCSDialog from "../../../../components/Common/PCSDialog/PCSDialog";
import PCSTextField from "../../../../components/Common/Form/PCSTextField";
import PCSSelect from "../../../../components/Common/Form/PCSSelect";
import PCSFormActions from "../../../../components/Common/Form/PCSFormActions";

import type { ReceiveMaterial } from "../types/receive";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: ReceiveMaterial) => void;
  receive?: ReceiveMaterial;
};

const emptyForm: ReceiveMaterial = {
  id: 0,
  receiptNo: "",
  poNo: "",
  supplier: "",
  warehouse: "",
  location: "",
  category: "",
  itemCode: "",
  itemName: "",
  quantity: 0,
  unit: "",
  receiveDate: "",
  inspector: "",
  documentNo: "",
  remarks: "",
  status: "Pending",
};

export default function ReceiveDialog({
  open,
  onClose,
  onSave,
  receive,
}: Props) {
  const [form, setForm] =
    useState<ReceiveMaterial>(emptyForm);

  const [loading] = useState(false);

  useEffect(() => {
    if (receive) {
      setForm(receive);
    } else {
      setForm({
        ...emptyForm,
        id: Date.now(),
      });
    }
  }, [receive, open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    onSave(form);
    onClose();
  }

  return (
    <PCSDialog
      open={open}
      title={
        receive
          ? "Edit Receive Material"
          : "New Receive Material"
      }
      onClose={onClose}
      maxWidth="lg"
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
                  status:
                    e.target.value as ReceiveMaterial["status"],
                })
              }
              options={[
                {
                  value: "Pending",
                  label: "Pending",
                },
                {
                  value: "Approved",
                  label: "Approved",
                },
                {
                  value: "Rejected",
                  label: "Rejected",
                },
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