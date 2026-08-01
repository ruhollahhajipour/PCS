import Grid from "@mui/material/Grid";
import KPICard from "../../../../components/Dashboard/KPICard";
import type { Issue } from "../types/issue";

type Props = {
  items: Issue[];
};

export default function IssueKPIs({ items }: Props) {

  const total = items.length;

  const pending = items.filter(
    x => x.status === "Pending"
  ).length;

  const approved = items.filter(
    x => x.status === "Approved"
  ).length;

  const rejected = items.filter(
    x => x.status === "Rejected"
  ).length;

  return (

    <Grid container spacing={2}>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Total Issues"
          value={String(total)}
          change=""
          
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Pending"
          value={String(pending)}
          change=""
          
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Approved"
          value={String(approved)}
          change=""
         
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <KPICard
          title="Rejected"
          value={String(rejected)}
          change=""
         
        />
      </Grid>

    </Grid>

  );

}