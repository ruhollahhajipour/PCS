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
  { month: "Apr", spi: 0.97 },
  { month: "May", spi: 1.01 },
  { month: "Jun", spi: 1.03 },
  { month: "Jul", spi: 1.02 },
  { month: "Aug", spi: 1.05 },
];

export default function DashboardSPIChart() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 5,
        height: 360,
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(16px)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Schedule Performance Index (SPI)
      </Typography>

      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis domain={[0.8, 1.1]} />

          <Tooltip />

          <ReferenceLine
            y={1}
            stroke="#EF4444"
            strokeDasharray="5 5"
            label="Target"
          />

          <Line
            type="monotone"
            dataKey="spi"
            stroke="#2563EB"
            strokeWidth={4}
            dot={{
              r: 6,
              fill: "#2563EB",
            }}
            activeDot={{
              r: 8,
            }}
          />

        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}