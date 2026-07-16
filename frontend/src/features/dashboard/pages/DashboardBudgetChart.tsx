import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

const data = [
  { month: "Jan", budget: 220, actual: 180 },
  { month: "Feb", budget: 250, actual: 210 },
  { month: "Mar", budget: 270, actual: 240 },
  { month: "Apr", budget: 300, actual: 295 },
  { month: "May", budget: 340, actual: 318 },
  { month: "Jun", budget: 380, actual: 350 },
  { month: "Jul", budget: 420, actual: 392 },
  { month: "Aug", budget: 460, actual: 438 },
];

export default function DashboardBudgetChart() {
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
          Budget vs Actual
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Monthly project budget comparison
        </Typography>
      </Box>

      <Box flex={1}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="budget"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="actual"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}