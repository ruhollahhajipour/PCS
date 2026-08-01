import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
  { month: "Jan", budget: 120, planned: 120, actual: 118, variance: -2 },
  { month: "Feb", budget: 165, planned: 170, actual: 168, variance: -2 },
  { month: "Mar", budget: 210, planned: 215, actual: 220, variance: 5 },
  { month: "Apr", budget: 260, planned: 270, actual: 268, variance: -2 },
  { month: "May", budget: 315, planned: 320, actual: 325, variance: 5 },
  { month: "Jun", budget: 370, planned: 380, actual: 378, variance: -2 },
  { month: "Jul", budget: 430, planned: 435, actual: 438, variance: 3 },
  { month: "Aug", budget: 495, planned: 500, actual: 503, variance: 3 },
  { month: "Sep", budget: 560, planned: 565, actual: 570, variance: 5 },
  { month: "Oct", budget: 625, planned: 630, actual: 628, variance: -2 },
  { month: "Nov", budget: 690, planned: 700, actual: 705, variance: 5 },
  { month: "Dec", budget: 760, planned: 770, actual: 768, variance: -2 },
];

export default function DashboardBudgetChart() {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        minHeight: 360,
        borderRadius: 4,
        p: 3,
        border: "1px solid rgba(148,163,184,.18)",
        background:
          "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Budget Trend
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Monthly Budget Progress
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 800,
            color: "primary.main",
          }}
        >
          $660M
        </Typography>
      </Box>

      <ResponsiveContainer
        width="100%"
        height="80%"
      >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="budget"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#2563EB"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#2563EB"
                stopOpacity={0.02}
              />
            </linearGradient>
                      </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            stroke="#E2E8F0"
          />

          <XAxis
    dataKey="month"
    interval={0}
    tickMargin={8}
    tick={{
        fontSize:11,
        fill:"#64748B"
    }}
    axisLine={false}
    tickLine={false}
/>

          <YAxis
            tick={{
              fill: "#64748B",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

         <Tooltip
    formatter={(value, name) => [`$${value} M`, name]}
    labelFormatter={(label) => `Month : ${label}`}
    contentStyle={{
        borderRadius:14,
        border:"none",
        boxShadow:"0 15px 35px rgba(15,23,42,.18)"
    }}
/>

          <Area
    type="monotone"
    dataKey="budget"
    stroke="#2563EB"
    strokeWidth={5}
    fill="url(#budget)"
    dot={false}
    activeDot={{
        r:8,
        stroke:"#FFFFFF",
        strokeWidth:3,
    }}
    animationDuration={1400}
/>

        </AreaChart>

      </ResponsiveContainer>

    </Paper>
  );
}