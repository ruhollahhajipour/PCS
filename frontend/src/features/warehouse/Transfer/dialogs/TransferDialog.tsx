import {
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

import PCSDialog from "../../../../components/Common/PCSDialog";

import { useState, useEffect } from "react";

import type { TransferMaterial } from "../types/transfer";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: TransferMaterial) => void;
  initialData?: TransferMaterial | null;
};

const emptyItem: TransferMaterial = {
  id: Date.now(),
  transferNo: "",
  fromWarehouse: "",
  toWarehouse: "",
  materialCode: "",
  materialName: "",
  quantity: 0,
  unit: "",
  transferDate: "",
  requestedBy: "",
  approvedBy: "",
  status: "Pending",
  description: "",
  createdAt: new Date().toISOString(),
};

export default function TransferDialog({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {

  const [form, setForm] =
    useState<TransferMaterial>(emptyItem);

  useEffect(() => {

    if (initialData)
      setForm(initialData);
    else
      setForm({
        ...emptyItem,
        id: Date.now(),
      });

  }, [initialData, open]);

  function change(
    key: keyof TransferMaterial,
    value: any
  ) {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  }

  return (

    <PCSDialog
      open={open}
      title="Transfer Material"
      onClose={onClose}
      onSave={() => onSave(form)}
      maxWidth="md"
    >

      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Transfer No"
            value={form.transferNo}
            onChange={(e) =>
              change("transferNo", e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Transfer Date"
            type="date"
            value={form.transferDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              change("transferDate", e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="From Warehouse"
            value={form.fromWarehouse}
            onChange={(e) =>
              change("fromWarehouse", e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="To Warehouse"
            value={form.toWarehouse}
            onChange={(e) =>
              change("toWarehouse", e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Material Code"
            value={form.materialCode}
            onChange={(e) =>
              change("materialCode", e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Material Name"
            value={form.materialName}
            onChange={(e) =>
              change("materialName", e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              change("quantity", Number(e.target.value))
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Unit"
            value={form.unit}
            onChange={(e) =>
              change("unit", e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Status"
            value={form.status}
            onChange={(e) =>
              change("status", e.target.value)
            }
          >
            <MenuItem value="Pending">
              Pending
            </MenuItem>

            <MenuItem value="Approved">
              Approved
            </MenuItem>

            <MenuItem value="Completed">
              Completed
            </MenuItem>

            <MenuItem value="Rejected">
              Rejected
            </MenuItem>

          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={form.description}
            onChange={(e) =>
              change("description", e.target.value)
            }
          />
        </Grid>

      </Grid>

    </PCSDialog>

  );

}