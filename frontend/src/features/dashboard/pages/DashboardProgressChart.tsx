import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const data = [
  {
    name: "Progress",
    value: 74,
    fill: "#2563EB",
  },
];

export default function DashboardProgressChart() {
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
        Overall Project Progress
      </Typography>

      <Box
        sx={{
          height: "88%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />

            <RadialBar
              background
              dataKey="value"
              cornerRadius={12}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <Box
          sx={{
            position: "absolute",
            textAlign: "center",
          }}
        >
          <Typography
            fontSize={46}
            fontWeight={800}
          >
            74%
          </Typography>

          <Typography
            color="text.secondary"
          >
            Completed
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}