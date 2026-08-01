import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", planned: 120, actual: 110 },
  { month: "Feb", planned: 180, actual: 165 },
  { month: "Mar", planned: 240, actual: 220 },
  { month: "Apr", planned: 300, actual: 295 },
  { month: "May", planned: 360, actual: 338 },
  { month: "Jun", planned: 430, actual: 410 },
  { month: "Jul", planned: 510, actual: 482 },
  { month: "Aug", planned: 590, actual: 560 },
];

export default function DashboardCostChart() {
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
        Cost Performance
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="88%"
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient id="planned" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.75} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
            </linearGradient>

            <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.75} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="planned"
            stroke="#2563EB"
            strokeWidth={3}
            fill="url(#planned)"
          />

          <Area
            type="monotone"
            dataKey="actual"
            stroke="#10B981"
            strokeWidth={3}
            fill="url(#actual)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}