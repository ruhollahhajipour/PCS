import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", cost: 120 },
  { month: "Feb", cost: 180 },
  { month: "Mar", cost: 165 },
  { month: "Apr", cost: 210 },
  { month: "May", cost: 260 },
  { month: "Jun", cost: 240 },
  { month: "Jul", cost: 290 },
  { month: "Aug", cost: 310 },
];

export default function DashboardChart() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        height: 420,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
      >
        Monthly Cost Trend
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="cost"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}