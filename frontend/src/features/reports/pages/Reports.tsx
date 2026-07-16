import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

import PageHeader from "../../../components/Common/PageHeader";

const cards = [
  {
    title: "Total Budget",
    value: "$1.26 B",
    color: "#2563EB",
    icon: <AccountBalanceWalletRoundedIcon fontSize="large" />,
  },
  {
    title: "Actual Cost",
    value: "$842 M",
    color: "#10B981",
    icon: <TrendingUpRoundedIcon fontSize="large" />,
  },
  {
    title: "Open Procurement",
    value: "134",
    color: "#F59E0B",
    icon: <AssignmentTurnedInRoundedIcon fontSize="large" />,
  },
  {
    title: "Warehouse Items",
    value: "18,240",
    color: "#7C3AED",
    icon: <Inventory2RoundedIcon fontSize="large" />,
  },
];

export default function Reports() {
  return (
    <Box width="100%">
      <PageHeader
        title="Executive Reports"
        subtitle="Management Dashboard & KPI"
      />

      <Grid container spacing={3}>
        {cards.map((item) => (
          <Grid
            key={item.title}
            size={{ xs: 12, sm: 6, lg: 3 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 5,
                background: "rgba(255,255,255,.85)",
                backdropFilter: "blur(18px)",
                boxShadow:
                  "0 20px 45px rgba(15,23,42,.08)",
                transition: ".3s",

                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: 3,
                  bgcolor: item.color,
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {item.icon}
              </Box>

              <Typography
                color="text.secondary"
                fontSize={14}
              >
                {item.title}
              </Typography>

              <Typography
                mt={1}
                fontSize={32}
                fontWeight={800}
              >
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              p: 3,
              mt: 1,
              height: 420,
              borderRadius: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 24,
              color: "#94A3B8",
            }}
          >
            Budget vs Actual Chart
            <br />
            (Recharts)
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              mt: 1,
              height: 420,
              borderRadius: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 22,
              color: "#94A3B8",
            }}
          >
            KPI Gauge
            <br />
            SPI / CPI
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              mt: 1,
              height: 340,
              borderRadius: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 22,
              color: "#94A3B8",
            }}
          >
            Monthly Cost Trend
            <br />
            (Area / Line Chart)
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}