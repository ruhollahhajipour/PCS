import Grid from "@mui/material/Grid";

import KPICard from "../../../../components/Dashboard/KPICard";

import type { TransferMaterial } from "../types/transfer";

type Props = {
  items: TransferMaterial[];
};

export default function TransferKPIs({ items }: Props) {

  const total = items.length;

  const pending = items.filter(
    x => x.status === "Pending"
  ).length;

  const approved = items.filter(
    x => x.status === "Approved"
  ).length;

  const completed = items.filter(
    x => x.status === "Completed"
  ).length;

  return (

    <Grid container spacing={2}>

      <Grid size={{ xs: 12, md: 4 }}>
        <KPICard
          title="Total Transfers"
          value={String(total)}
        />
      </Grid>
<Grid size={{ xs: 12, md: 3 }}>
  <KPICard
    title="Approved"
    value={String(approved)}
  />
</Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <KPICard
          title="Pending"
          value={String(pending)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <KPICard
          title="Completed"
          value={String(completed)}
        />
      </Grid>

    </Grid>

  );

}