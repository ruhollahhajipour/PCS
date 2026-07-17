import { useMemo, useState } from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import KPICard from "../../../components/Common/KPI/KPICard";
import PCSDataGrid from "../../../components/Common/PCSDataGrid/PCSDataGrid";
import StatusChip from "../../../components/Common/StatusChip";

import DashboardBudgetChart from "../../dashboard/pages/DashboardBudgetChart";
import DashboardCostChart from "../../dashboard/pages/DashboardCostChart";
import DashboardSPIChart from "../../dashboard/pages/DashboardSPIChart";
import DashboardCashFlowChart from "../../dashboard/pages/DashboardCashFlowChart";

import WBSTree from "../components/WBSTree";
import CostBreakdownChart from "../components/CostBreakdownChart";

import useCostControl from "../hooks/useCostControl";

export default function CostControl() {

  const { items, loading } = useCostControl();

  const [search] = useState("");

  const rows = useMemo(() => {
    const q = search.toLowerCase();

    return items.filter((x) =>
      x.wbs.toLowerCase().includes(q) ||
      x.project.toLowerCase().includes(q) ||
      x.discipline.toLowerCase().includes(q)
    );
  }, [items, search]);

  const totalBudget = rows.reduce((a,b)=>a+b.budget,0);
  const totalActual = rows.reduce((a,b)=>a+b.actual,0);
  const totalForecast = rows.reduce((a,b)=>a+b.forecast,0);
  const totalVariance = rows.reduce((a,b)=>a+b.variance,0);

  return (
    <Box>

      <Typography variant="h4" fontWeight={800} mb={3}>
        Cost Control Dashboard
      </Typography>

      <Grid container spacing={3}>

        <Grid size={{xs:12,md:3}}>
          <KPICard title="Budget" value={`$${(totalBudget/1000000).toFixed(1)}M`} change="+2.1%"/>
        </Grid>

        <Grid size={{xs:12,md:3}}>
          <KPICard title="Actual Cost" value={`$${(totalActual/1000000).toFixed(1)}M`} change="+1.8%"/>
        </Grid>

        <Grid size={{xs:12,md:3}}>
          <KPICard title="Forecast" value={`$${(totalForecast/1000000).toFixed(1)}M`} change="+3.4%"/>
        </Grid>

        <Grid size={{xs:12,md:3}}>
          <KPICard title="Variance" value={`$${(totalVariance/1000000).toFixed(1)}M`} change="-1.2%"/>
        </Grid>

        <Grid size={{xs:12,md:4}}>
          <CostBreakdownChart/>
        </Grid>

        <Grid size={{xs:12,md:8}}>
          <DashboardBudgetChart/>
        </Grid>

        <Grid size={{xs:12,md:6}}>
          <DashboardCostChart/>
        </Grid>

        <Grid size={{xs:12,md:6}}>
          <DashboardSPIChart/>
        </Grid>

        <Grid size={{xs:12,md:12}}>
          <DashboardCashFlowChart/>
        </Grid>

        <Grid size={{xs:12,md:3}}>
          <WBSTree/>
        </Grid>

        <Grid size={{xs:12,md:9}}>
          <Paper sx={{borderRadius:5,overflow:"hidden"}}>
            <PCSDataGrid
              rows={rows}
              loading={loading}
              columns={[
                {field:"wbs",headerName:"WBS",flex:1},
                {field:"project",headerName:"Project",flex:2},
                {field:"discipline",headerName:"Discipline",flex:1},
                {field:"budget",headerName:"Budget",flex:1},
                {field:"commitment",headerName:"Commitment",flex:1},
                {field:"actual",headerName:"Actual",flex:1},
                {field:"forecast",headerName:"Forecast",flex:1},
                {field:"variance",headerName:"Variance",flex:1},
                {
                  field:"progress",
                  headerName:"Progress",
                  flex:.8,
                  renderCell:(params:any)=>
                    <Typography fontWeight={700}>{params.value}%</Typography>
                },
                {
                  field:"status",
                  headerName:"Status",
                  flex:1,
                  renderCell:(params:any)=>
                    <StatusChip value={params.value}/>
                },
                {field:"updatedAt",headerName:"Updated",flex:1},
              ]}
            />
          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
}
