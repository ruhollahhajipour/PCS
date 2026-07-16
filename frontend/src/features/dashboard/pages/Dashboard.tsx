import Grid from "@mui/material/Grid";

import {
  Folder,
  Business,
  AccountBalanceWallet,
  Warehouse,
  
} from "@mui/icons-material";

import KPICard from "../../../components/Common/KPI/KPICard";

import DashboardBudgetChart from "./DashboardBudgetChart";
import DashboardCostChart from "./DashboardCostChart";
import DashboardSPIChart from "./DashboardSPIChart";
import DashboardCashFlowChart from "./DashboardCashFlowChart";

export default function Dashboard() {
  return (
    <Grid container spacing={3}>

      <Grid size={{ xs:12,md:3 }}>
        <KPICard
          title="Projects"
          value="24"
          change="+4%"
          icon={<Folder color="primary"/>}
        />
      </Grid>

      <Grid size={{ xs:12,md:3 }}>
        <KPICard
          title="Companies"
          value="8"
          change="+2%"
          icon={<Business color="primary"/>}
        />
      </Grid>

      <Grid size={{ xs:12,md:3 }}>
        <KPICard
          title="Budget"
          value="$1.25B"
          change="+8%"
          icon={<AccountBalanceWallet color="primary"/>}
        />
      </Grid>

      <Grid size={{ xs:12,md:3 }}>
        <KPICard
          title="Warehouse"
          value="91%"
          change="+3%"
          icon={<Warehouse color="primary"/>}
        />
      </Grid>

      <Grid size={{ xs:12,md:6 }}>
        <DashboardBudgetChart/>
      </Grid>

      <Grid size={{ xs:12,md:6 }}>
        <DashboardCostChart/>
      </Grid>

      <Grid size={{ xs:12,md:6 }}>
        <DashboardSPIChart/>
      </Grid>

      <Grid size={{ xs:12,md:6 }}>
        <DashboardCashFlowChart/>
      </Grid>

    </Grid>
  );
}