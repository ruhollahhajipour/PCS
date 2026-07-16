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
  {
    category: "Pipes",
    stock: 320,
  },
  {
    category: "Valves",
    stock: 210,
  },
  {
    category: "Flanges",
    stock: 185,
  },
  {
    category: "Fittings",
    stock: 265,
  },
  {
    category: "Instruments",
    stock: 95,
  },
];

export default function DashboardWarehouseChart() {
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
        Warehouse Stock
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="88%"
      >
        <BarChart
          data={data}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" />

          <YAxis
            dataKey="category"
            type="category"
            width={90}
          />

          <Tooltip />

          <Bar
            dataKey="stock"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}