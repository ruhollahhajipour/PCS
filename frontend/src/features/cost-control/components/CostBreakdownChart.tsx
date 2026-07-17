import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  {
    name: "Budget",
    value: 820,
  },
  {
    name: "Actual",
    value: 690,
  },
  {
    name: "Forecast",
    value: 780,
  },
];

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
];

export default function CostBreakdownChart() {
  return (
    <Card
      sx={{
        borderRadius: 5,
        height: 420,
      }}
    >
      <CardContent
        sx={{ height: "100%" }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Cost Breakdown
        </Typography>

        <ResponsiveContainer
          width="100%"
          height="90%"
        >
          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              outerRadius={120}
              paddingAngle={4}
            >
              {data.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip
              formatter={(v: any) => [
                `$${v} M`,
                "",
              ]}
            />

            <Legend />

          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}