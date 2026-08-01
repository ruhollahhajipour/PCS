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
  { month: "Jan", cpi: 0.92 },
  { month: "Feb", cpi: 0.95 },
  { month: "Mar", cpi: 0.97 },
  { month: "Apr", cpi: 1.01 },
  { month: "May", cpi: 1.03 },
  { month: "Jun", cpi: 1.05 },
  { month: "Jul", cpi: 1.02 },
  { month: "Aug", cpi: 1.04 },
];

export default function DashboardCPIChart() {
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
        Cost Performance Index (CPI)
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
            dataKey="cpi"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}