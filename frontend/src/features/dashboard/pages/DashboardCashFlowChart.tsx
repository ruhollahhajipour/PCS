import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", inflow: 22, outflow: 18, balance: 4 },
  { month: "Feb", inflow: 28, outflow: 23, balance: 5 },
  { month: "Mar", inflow: 32, outflow: 29, balance: 3 },
  { month: "Apr", inflow: 35, outflow: 31, balance: 4 },
  { month: "May", inflow: 38, outflow: 34, balance: 4 },
  { month: "Jun", inflow: 42, outflow: 37, balance: 5 },
  { month: "Jul", inflow: 46, outflow: 41, balance: 5 },
  { month: "Aug", inflow: 52, outflow: 46, balance: 6 },
];

export default function DashboardCashFlowChart() {
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
        Cash Flow
      </Typography>

      <ResponsiveContainer width="100%" height="88%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="inflow"
            radius={[6, 6, 0, 0]}
            fill="#2563EB"
          />

          <Bar
            dataKey="outflow"
            radius={[6, 6, 0, 0]}
            fill="#F59E0B"
          />

          <Line
            dataKey="balance"
            stroke="#10B981"
            strokeWidth={4}
            dot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
}