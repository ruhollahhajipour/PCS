import Grid from "@mui/material/Grid";

import KPICard from "../../../components/Common/KPI";

import DashboardBudgetChart from "./DashboardBudgetChart";
import DashboardCostChart from "./DashboardCostChart";
import DashboardCashFlowChart from "./DashboardCashFlowChart";
import DashboardProgressChart from "./DashboardProgressChart";
import DashboardSPIChart from "./DashboardSPIChart";
import DashboardCPIChart from "./DashboardCPIChart";
import DashboardWarehouseChart from "./DashboardWarehouseChart";
import DashboardProcurementChart from "./DashboardProcurementChart";

export default function ExecutiveDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="Total Budget"
          value="$145 M"
          change="+8.2%"
          
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="Actual Cost"
          value="$132 M"
          change="+5.4%"
          
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="SPI"
          value="0.97"
          change="-2.1%"
          
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KPICard
          title="CPI"
          value="1.04"
          change="+4.8%"
          
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardBudgetChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardCostChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardCashFlowChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardProgressChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSPIChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardCPIChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardWarehouseChart />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardProcurementChart />
      </Grid>
    </Grid>
  );
}