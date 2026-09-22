import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { month: "Jan", cost: 120 },
  { month: "Feb", cost: 180 },
  { month: "Mar", cost: 165 },
  { month: "Apr", cost: 210 },
  { month: "May", cost: 260 },
  { month: "Jun", cost: 240 },
  { month: "Jul", cost: 290 },
  { month: "Aug", cost: 310 },
];

const current = data[data.length - 1];
const previous = data[data.length - 2];

const change =
  previous && previous.cost !== 0
    ? ((current.cost - previous.cost) / previous.cost) * 100
    : 0;

const isIncreasing = change > 0;

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = Number(payload[0]?.value ?? 0);

  return (
    <Box
      sx={{
        minWidth: 155,
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 12px 30px rgba(15,23,42,.12)",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 800,
          color: "#0F172A",
          mb: 0.9,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            color: "#64748B",
          }}
        >
          Actual Cost
        </Typography>

        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 800,
            color: "#2563EB",
          }}
        >
          ${value}M
        </Typography>
      </Box>
    </Box>
  );
}

export default function DashboardChart() {
  return (
    <Paper
      elevation={0}
      sx={{
        height: 360,
        minHeight: 360,

        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        borderRadius: 4,

        border: "1px solid rgba(148,163,184,.18)",

        background:
          "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",

        overflow: "hidden",

        "@media print": {
          height: 340,
          minHeight: 340,
          borderRadius: 2,
          background: "#FFFFFF",
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: 14,
                sm: 15,
              },

              fontWeight: 800,
              lineHeight: 1.25,
              color: "#0F172A",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Monthly Cost Trend
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10.5,
              color: "#64748B",
              lineHeight: 1.3,
            }}
          >
            Actual project cost over time
          </Typography>
        </Box>

        {/* CURRENT COST */}

        <Box
          sx={{
            flexShrink: 0,
            textAlign: "right",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 21,
                sm: 23,
              },

              lineHeight: 1,
              fontWeight: 850,
              letterSpacing: "-0.03em",
              color: "#2563EB",
            }}
          >
            ${current.cost}M
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Current Cost
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",

          gap: {
            xs: 0.75,
            sm: 1,
          },

          mb: 1.5,
        }}
      >
        {/* CURRENT */}

        <Box
          sx={{
            minWidth: 0,
            p: {
              xs: 0.9,
              sm: 1,
            },

            borderRadius: 2,
            bgcolor: "#F8FAFC",
            border: "1px solid #EEF2F7",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
              fontWeight: 650,
            }}
          >
            CURRENT
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: 11,
                sm: 12,
              },

              fontWeight: 800,
              color: "#2563EB",
              whiteSpace: "nowrap",
            }}
          >
            ${current.cost}M
          </Typography>
        </Box>

        {/* PREVIOUS */}

        <Box
          sx={{
            minWidth: 0,
            p: {
              xs: 0.9,
              sm: 1,
            },

            borderRadius: 2,
            bgcolor: "#F8FAFC",
            border: "1px solid #EEF2F7",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
              fontWeight: 650,
            }}
          >
            PREVIOUS
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: 11,
                sm: 12,
              },

              fontWeight: 800,
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            ${previous?.cost ?? 0}M
          </Typography>
        </Box>

        {/* VARIANCE */}

        <Box
          sx={{
            minWidth: 0,
            p: {
              xs: 0.9,
              sm: 1,
            },

            borderRadius: 2,

            bgcolor: isIncreasing
              ? "#FEF2F2"
              : "#F0FDF4",

            border: isIncreasing
              ? "1px solid #FEE2E2"
              : "1px solid #DCFCE7",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
              fontWeight: 650,
            }}
          >
            MoM CHANGE
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: 11,
                sm: 12,
              },

              fontWeight: 800,

              color: isIncreasing
                ? "#B91C1C"
                : "#15803D",

              whiteSpace: "nowrap",
            }}
          >
            {change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          LEGEND
      ===================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.7,
          mb: 0.5,
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 3,
            borderRadius: 5,
            bgcolor: "#2563EB",
          }}
        />

        <Typography
          sx={{
            fontSize: 9,
            color: "#64748B",
            fontWeight: 650,
          }}
        >
          Actual Cost
        </Typography>
      </Box>

      {/* =====================================================
          CHART
      ===================================================== */}

      <Box
        sx={{
          height: 205,
          minWidth: 0,

          "& .recharts-wrapper": {
            overflow: "visible",
          },
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -24,
              bottom: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="3 5"
            />

            <XAxis
              dataKey="month"
              interval={0}
              tickMargin={8}
              tick={{
                fontSize: 9,
                fill: "#64748B",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 9,
                fill: "#94A3B8",
              }}
              axisLine={false}
              tickLine={false}
              width={36}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "rgba(37,99,235,.045)",
              }}
            />

            <Bar
              dataKey="cost"
              radius={[7, 7, 2, 2]}
              maxBarSize={38}
              animationDuration={900}
            >
              {data.map((item, index) => {
                const isCurrent =
                  index === data.length - 1;

                return (
                  <Cell
                    key={`cell-${item.month}`}
                    fill={
                      isCurrent
                        ? "#2563EB"
                        : "#93C5FD"
                    }
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Box
        sx={{
          mt: 0.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            color: "#94A3B8",
          }}
        >
          Monthly actual cost
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,
            color: isIncreasing
              ? "#B91C1C"
              : "#15803D",

            whiteSpace: "nowrap",
          }}
        >
          {isIncreasing
            ? "Cost increased"
            : "Cost improved"}
        </Typography>
      </Box>
    </Paper>
  );
}