import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 260 },
  { month: "Apr", value: 340 },
  { month: "May", value: 420 },
  { month: "Jun", value: 500 },
  { month: "Jul", value: 580 },
  { month: "Aug", value: 660 },
];

export default function DashboardBudgetChart() {
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
        Budget Trend
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="88%"
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="budget"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2563EB"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#2563EB"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563EB"
            strokeWidth={4}
            fill="url(#budget)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}