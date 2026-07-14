import { Grid, Box, Paper, Typography } from "@mui/material";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import KPICard from "../components/KPI/KPICard";
import PageHeader from "../components/Common/PageHeader";

export default function Dashboard() {
  return (
    <Box width="100%">
      <PageHeader
        title="Dashboard"
        subtitle="Project Cost Control Overview"
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <KPICard
            title="Project Budget"
            value="$120 M"
            change="+8.2%"
            color="#2563EB"
            icon={<AccountBalanceWalletRoundedIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <KPICard
            title="Actual Cost"
            value="$86 M"
            change="+2.4%"
            color="#10B981"
            icon={<PaidRoundedIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <KPICard
            title="SPI"
            value="0.94"
            change="-1.3%"
            color="#F59E0B"
            icon={<TimelineRoundedIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <KPICard
            title="CPI"
            value="1.08"
            change="+4.1%"
            color="#7C3AED"
            icon={<TrendingUpRoundedIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              p: 4,
              height: 430,
              borderRadius: 5,
              background: "rgba(255,255,255,.82)",
              backdropFilter: "blur(18px)",
              boxShadow:
                "0 20px 50px rgba(15,23,42,.08)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 22,
                mb: 3,
              }}
            >
              Project Cost Trend
            </Typography>

            <Box
              sx={{
                height: 320,
                borderRadius: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#94A3B8",
                bgcolor: "#F8FAFC",
                border: "2px dashed #CBD5E1",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Chart Area
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 4,
              height: 430,
              borderRadius: 5,
              background: "rgba(255,255,255,.82)",
              backdropFilter: "blur(18px)",
              boxShadow:
                "0 20px 50px rgba(15,23,42,.08)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 22,
                mb: 3,
              }}
            >
              Project Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography color="#94A3B8">
                Company
              </Typography>

              <Typography fontWeight={700}>
                Kousha Gaman Namavar
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography color="#94A3B8">
                Plant
              </Typography>

              <Typography fontWeight={700}>
                South Adish Gas Condensate Refinery
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography color="#94A3B8">
                Project
              </Typography>

              <Typography fontWeight={700}>
                PCS Development
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography color="#94A3B8">
                Progress
              </Typography>

              <Typography
                fontWeight={800}
                color="#10B981"
              >
                42 %
              </Typography>
            </Box>

            <Box>
              <Typography color="#94A3B8">
                Status
              </Typography>

              <Typography
                fontWeight={800}
                color="#2563EB"
              >
                Running
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}