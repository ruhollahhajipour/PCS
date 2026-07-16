import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Approved",
    value: 62,
  },
  {
    name: "Pending",
    value: 21,
  },
  {
    name: "Draft",
    value: 11,
  },
  {
    name: "Cancelled",
    value: 6,
  },
];

const colors = [
  "#2E7D32",
  "#ED6C02",
  "#1976D2",
  "#D32F2F",
];

export default function DashboardProcurementChart() {
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
        Procurement Status
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="88%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            innerRadius={60}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={colors[index]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}