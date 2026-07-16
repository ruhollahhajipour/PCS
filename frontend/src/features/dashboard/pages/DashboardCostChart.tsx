import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        height: 380,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Cost Performance Trend
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Planned vs actual project cost
        </Typography>
      </Box>

      <Box flex={1}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="planned"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="actual"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}