import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";

import type { PmsEvm } from "../../pms/api/pmsApi";

type Props = {
  data: PmsEvm;
};

function formatValue(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EVMCard({ data }: Props) {
  const items = [
    { title: "Planned Value (PV)", value: data.plannedValue },
    { title: "Earned Value (EV)", value: data.earnedValue },
    { title: "Actual Cost (AC)", value: data.actualCost },
    { title: "Cost Variance (CV)", value: data.costVariance },
    { title: "Schedule Variance (SV)", value: data.scheduleVariance },
  ];

  return (
    <Card sx={{ borderRadius: 3 }} variant="outlined">
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={750}>
            Earned Value Management (EVM)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Approved baseline: {data.baselineName} · Version {data.baselineVersion}
            {" · "}Data date: {new Date(data.reportDate).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Baseline budget: {formatValue(data.baselineBudget)} · Activities: {data.baselineActivityCount}
          </Typography>
        </Box>

        <Grid container spacing={1.5}>
          {items.map(item => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ height: "100%", borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h6" fontWeight={750} mt={1}>
                    {formatValue(item.value)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip
            label={`CPI: ${data.cpi.toFixed(2)}`}
            color={data.cpi >= 1 ? "success" : "warning"}
          />
          <Chip
            label={`SPI: ${data.spi.toFixed(2)}`}
            color={data.spi >= 1 ? "success" : "warning"}
          />
          <Chip
            label={data.costVariance >= 0 ? "Under Budget" : "Over Budget"}
            color={data.costVariance >= 0 ? "success" : "error"}
          />
          <Chip
            label={data.scheduleVariance >= 0 ? "Ahead Schedule" : "Behind Schedule"}
            color={data.scheduleVariance >= 0 ? "success" : "error"}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
