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
  Legend,
} from "recharts";

const data = [
  { month: "Jan", planned: 5, actual: 4 },
  { month: "Feb", planned: 12, actual: 10 },
  { month: "Mar", planned: 20, actual: 18 },
  { month: "Apr", planned: 32, actual: 30 },
  { month: "May", planned: 48, actual: 45 },
  { month: "Jun", planned: 63, actual: 60 },
  { month: "Jul", planned: 78, actual: 74 },
  { month: "Aug", planned: 90, actual: 86 },
];

export default function DashboardProgressChart() {
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
        Project Progress (%)
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="88%"
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis
            domain={[0, 100]}
          />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="planned"
            name="Planned"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}