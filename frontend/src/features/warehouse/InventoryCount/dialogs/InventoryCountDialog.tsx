import { useEffect, useState } from "react";

import {
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

import PCSDialog from "../../../../components/Common/PCSDialog";

import type { InventoryCount } from "../types/inventoryCount";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: InventoryCount) => void;
  initialData?: InventoryCount | null;
};

const emptyItem: InventoryCount = {
  id: 0,
  countNo: "",
  warehouse: "",
  location: "",
  materialCode: "",
  materialName: "",
  systemQty: 0,
  countedQty: 0,
  variance: 0,
  unit: "",
  countDate: "",
  countedBy: "",
  approvedBy: "",
  status: "Draft",
  description: "",
  createdAt: new Date().toISOString(),
};

export default function InventoryCountDialog({

  open,

  onClose,

  onSave,

  initialData,

}: Props) {

  const [form, setForm] =
    useState<InventoryCount>(emptyItem);

  useEffect(() => {

    if (initialData)

      setForm(initialData);

    else

      setForm({

        ...emptyItem,

        id: Date.now(),

      });

  }, [initialData, open]);

  function updateField(

    key: keyof InventoryCount,

    value: any

  ) {

    const updated = {

      ...form,

      [key]: value,

    };

    updated.variance =
      Number(updated.countedQty) -
      Number(updated.systemQty);

    setForm(updated);

  }

  return (

    <PCSDialog

      open={open}

      title="Inventory Count"

      onClose={onClose}

      onSave={() => onSave(form)}

      maxWidth="md"

    >

      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Count No"
            value={form.countNo}
            onChange={(e)=>
              updateField("countNo",e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="date"
            label="Count Date"
            InputLabelProps={{shrink:true}}
            value={form.countDate}
            onChange={(e)=>
              updateField("countDate",e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:6 }}>
          <TextField
            fullWidth
            label="Warehouse"
            value={form.warehouse}
            onChange={(e)=>
              updateField("warehouse",e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:6 }}>
          <TextField
            fullWidth
            label="Location"
            value={form.location}
            onChange={(e)=>
              updateField("location",e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:6 }}>
          <TextField
            fullWidth
            label="Material Code"
            value={form.materialCode}
            onChange={(e)=>
              updateField("materialCode",e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:6 }}>
          <TextField
            fullWidth
            label="Material Name"
            value={form.materialName}
            onChange={(e)=>
              updateField("materialName",e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:4 }}>
          <TextField
            fullWidth
            type="number"
            label="System Qty"
            value={form.systemQty}
            onChange={(e)=>
              updateField(
                "systemQty",
                Number(e.target.value)
              )
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:4 }}>
          <TextField
            fullWidth
            type="number"
            label="Counted Qty"
            value={form.countedQty}
            onChange={(e)=>
              updateField(
                "countedQty",
                Number(e.target.value)
              )
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:4 }}>
          <TextField
            fullWidth
            label="Variance"
            value={form.variance}
            InputProps={{
              readOnly:true,
            }}
          />
        </Grid>

        <Grid size={{ xs:12,md:6 }}>
          <TextField
            fullWidth
            label="Unit"
            value={form.unit}
            onChange={(e)=>
              updateField("unit",e.target.value)
            }
          />
        </Grid>

        <Grid size={{ xs:12,md:6 }}>
          <TextField
            select
            fullWidth
            label="Status"
            value={form.status}
            onChange={(e)=>
              updateField("status",e.target.value)
            }
          >
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs:12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={form.description}
            onChange={(e)=>
              updateField("description",e.target.value)
            }
          />
        </Grid>

      </Grid>

    </PCSDialog>

  );

}