import {
  Grid,
  Paper,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

import type { Material } from "../../../models/material";

type Props = {
  material: Material;
};

function Item({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        fontWeight={600}
      >
        {value}
      </Typography>
    </Grid>
  );
}

export default function MaterialDetails({
  material,
}: Props) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Material Details
      </Typography>

      <Grid container spacing={3}>

        <Item
          title="Code"
          value={material.code}
        />

        <Item
          title="Short Name"
          value={material.shortName}
        />

        <Item
          title="Material Name"
          value={material.name}
        />

        <Item
          title="Category"
          value={material.category}
        />

        <Item
          title="Specification"
          value={material.specification}
        />

        <Item
          title="Manufacturer"
          value={material.manufacturer}
        />

        <Item
          title="Part Number"
          value={material.partNumber}
        />

        <Item
          title="Warehouse ID"
          value={material.warehouseId}
        />

        <Item
          title="Unit"
          value={material.unit}
        />

        <Item
          title="Current Stock"
          value={material.currentStock}
        />

        <Item
          title="Minimum Stock"
          value={material.minStock}
        />

        <Item
          title="Maximum Stock"
          value={material.maxStock}
        />

        <Item
          title="Unit Price"
          value={`${material.unitPrice.toLocaleString()} ${material.currency}`}
        />

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Status
          </Typography>

          <br />

          <Chip
            label={material.status}
            color={
              material.status === "Active"
                ? "success"
                : "default"
            }
          />
        </Grid>

      </Grid>
    </Paper>
  );
}