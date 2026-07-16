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
  { month: "Jan", cash: 120 },
  { month: "Feb", cash: 180 },
  { month: "Mar", cash: 260 },
  { month: "Apr", cash: 330 },
  { month: "May", cash: 410 },
  { month: "Jun", cash: 490 },
  { month: "Jul", cash: 620 },
  { month: "Aug", cash: 710 },
];

export default function DashboardCashFlowChart() {
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
        Cash Flow
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="88%"
      >
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="cash"
            strokeWidth={3}
            fillOpacity={0.35}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}