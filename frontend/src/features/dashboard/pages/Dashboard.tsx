import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

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
    <Box>

      <Typography
        sx={{
          fontSize: 34,
          fontWeight: 800,
          mb: .5,
        }}
      >
        Executive Dashboard
      </Typography>

      <Typography
        sx={{
          color: "#64748B",
          mb: 4,
        }}
      >
        South Adish Gas Condensate Refinery
      </Typography>

      <Grid container spacing={3}>

        <Grid size={{ xs:12, md:3 }}>
          <KPICard
            title="Projects"
            value="24"
            change="+4%"
            icon={<Folder color="primary"/>}
          />
        </Grid>

        <Grid size={{ xs:12, md:3 }}>
          <KPICard
            title="Companies"
            value="8"
            change="+2%"
            icon={<Business color="primary"/>}
          />
        </Grid>

        <Grid size={{ xs:12, md:3 }}>
          <KPICard
            title="Budget"
            value="$1.25 B"
            change="+8%"
            icon={<AccountBalanceWallet color="primary"/>}
          />
        </Grid>

        <Grid size={{ xs:12, md:3 }}>
          <KPICard
            title="Warehouse"
            value="91%"
            change="+3%"
            icon={<Warehouse color="primary"/>}
          />
        </Grid>

        <Grid size={{ xs:12, lg:8 }}>
          <DashboardBudgetChart/>
        </Grid>

        <Grid size={{ xs:12, lg:4 }}>

          <Paper
            sx={{
              p:3,
              borderRadius:5,
              height:360,
              background:"rgba(255,255,255,.82)",
              backdropFilter:"blur(16px)"
            }}
          >

            <Typography
              fontWeight={700}
              fontSize={22}
              mb={3}
            >
              Project Status
            </Typography>

            <Typography
              color="text.secondary"
              mb={1}
            >
              EPC Progress
            </Typography>

            <LinearProgress
              variant="determinate"
              value={74}
              sx={{
                height:12,
                borderRadius:8,
                mb:3,
              }}
            />

            <Typography
              fontWeight={700}
            >
              Overall Progress

              <Typography
                component="span"
                color="primary"
                ml={1}
              >
                74%
              </Typography>

            </Typography>

            <Box mt={5}>

              <Typography
                fontWeight={700}
                mb={2}
              >
                Recent Activities
              </Typography>

              <Typography mb={1}>
                ✔ Budget Updated
              </Typography>

              <Typography mb={1}>
                ✔ Procurement Approved
              </Typography>

              <Typography mb={1}>
                ✔ Warehouse Synced
              </Typography>

              <Typography>
                ✔ Cost Report Generated
              </Typography>

            </Box>

          </Paper>

        </Grid>

        <Grid size={{ xs:12, md:6 }}>
          <DashboardCostChart/>
        </Grid>

        <Grid size={{ xs:12, md:6 }}>
          <DashboardCashFlowChart/>
        </Grid>

        <Grid size={{ xs:12, md:6 }}>
          <DashboardSPIChart/>
        </Grid>

      </Grid>

    </Box>
  );
}