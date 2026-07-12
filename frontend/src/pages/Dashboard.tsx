import { Grid, Box } from "@mui/material";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import PageHeader from "../components/Common/PageHeader";
import KPICard from "../components/KPI/KPICard";

export default function Dashboard() {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to Project Control System"
      />

      <Grid
        container
        spacing={3}
        sx={{
          mt: 1,
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="Project Budget"
            value="$120 M"
            change="+8.2%"
            color="#4F7CFF"
            icon={<AccountBalanceWalletRoundedIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="Actual Cost"
            value="$86 M"
            change="+2.4%"
            color="#10B981"
            icon={<PaidRoundedIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="SPI"
            value="0.94"
            change="-1.3%"
            color="#F59E0B"
            icon={<TimelineRoundedIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="CPI"
            value="1.08"
            change="+4.1%"
            color="#7C3AED"
            icon={<TrendingUpRoundedIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}