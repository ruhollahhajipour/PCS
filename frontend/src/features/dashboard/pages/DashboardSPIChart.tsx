import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

const data = [
  { month: "Jan", spi: 0.88 },
  { month: "Feb", spi: 0.91 },
  { month: "Mar", spi: 0.95 },
  { month: "Apr", spi: 0.99 },
  { month: "May", spi: 1.02 },
  { month: "Jun", spi: 1.04 },
  { month: "Jul", spi: 1.01 },
  { month: "Aug", spi: 1.03 },
];

export default function DashboardSPIChart() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        height: 360,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Schedule Performance Index (SPI)
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="88%"
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis
            domain={[0.8, 1.2]}
          />

          <Tooltip />

          <ReferenceLine
            y={1}
            stroke="#d32f2f"
            strokeDasharray="5 5"
            label="Target"
          />

          <Line
            type="monotone"
            dataKey="spi"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}