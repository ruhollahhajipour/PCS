import Grid from "@mui/material/Grid";

import KPICard from "../../../../components/Dashboard/KPICard";

import type { InventoryCount } from "../types/inventoryCount";

type Props = {
  items: InventoryCount[];
};

export default function InventoryCountKPIs({
  items,
}: Props) {

  const total = items.length;

  const draft = items.filter(
    x => x.status === "Draft"
  ).length;

  const progress = items.filter(
    x => x.status === "In Progress"
  ).length;

  const completed = items.filter(
    x => x.status === "Completed"
  ).length;

  const approved = items.filter(
    x => x.status === "Approved"
  ).length;

  return (

    <Grid container spacing={2}>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Total Counts"
          value={String(total)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Draft"
          value={String(draft)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="In Progress"
          value={String(progress)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
  <KPICard
    title="Completed"
    value={String(completed)}
  />
</Grid>

<Grid size={{ xs: 12, md: 3 }}>
  <KPICard
    title="Approved"
    value={String(approved)}
  />
</Grid>

    </Grid>

  );

}