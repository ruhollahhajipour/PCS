import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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
  { month: "Jan", budget: 120, planned: 120, actual: 118 },
  { month: "Feb", budget: 165, planned: 170, actual: 168 },
  { month: "Mar", budget: 210, planned: 215, actual: 220 },
  { month: "Apr", budget: 260, planned: 270, actual: 268 },
  { month: "May", budget: 315, planned: 320, actual: 325 },
  { month: "Jun", budget: 370, planned: 380, actual: 378 },
  { month: "Jul", budget: 430, planned: 435, actual: 438 },
  { month: "Aug", budget: 495, planned: 500, actual: 503 },
  { month: "Sep", budget: 560, planned: 565, actual: 570 },
  { month: "Oct", budget: 625, planned: 630, actual: 628 },
  { month: "Nov", budget: 690, planned: 700, actual: 705 },
  { month: "Dec", budget: 760, planned: 770, actual: 768 },
];

const current = data[data.length - 1];

const variance = current.actual - current.planned;

const variancePercent =
  current.planned !== 0
    ? (variance / current.planned) * 100
    : 0;

const budgetRemaining = current.budget - current.actual;

const budgetUtilization =
  current.budget !== 0
    ? (current.actual / current.budget) * 100
    : 0;

type TooltipPayloadItem = {
  value?: number;
  dataKey?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const labels: Record<string, string> = {
    budget: "Approved Budget",
    planned: "Planned Cost",
    actual: "Actual Cost",
  };

  const colors: Record<string, string> = {
    budget: "#94A3B8",
    planned: "#2563EB",
    actual: "#0F766E",
  };

  const planned =
    payload.find((item) => item.dataKey === "planned")?.value ?? 0;

  const actual =
    payload.find((item) => item.dataKey === "actual")?.value ?? 0;

  const monthlyVariance = Number(actual) - Number(planned);

  return (
    <Box
      sx={{
        minWidth: 190,
        px: 1.5,
        py: 1.35,
        borderRadius: 2.5,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 14px 35px rgba(15,23,42,.14)",
      }}
    >
      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 800,
          color: "#0F172A",
          mb: 1,
        }}
      >
        {label}
      </Typography>

      {payload.map((item) => {
        const key = item.dataKey ?? "";

        return (
          <Box
            key={key}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 0.6,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: colors[key] ?? "#64748B",
                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  fontSize: 9.5,
                  color: "#64748B",
                }}
              >
                {labels[key] ?? key}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              ${item.value ?? 0}M
            </Typography>
          </Box>
        );
      })}

      <Box
        sx={{
          mt: 1,
          pt: 1,
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            color: "#64748B",
          }}
        >
          Monthly Variance
        </Typography>

        <Typography
          sx={{
            fontSize: 9.5,
            fontWeight: 800,
            color:
              monthlyVariance <= 0
                ? "#15803D"
                : "#B91C1C",
          }}
        >
          {monthlyVariance > 0 ? "+" : ""}
          {monthlyVariance}M
        </Typography>
      </Box>
    </Box>
  );
}

const legendItems = [
  {
    label: "Approved Budget",
    color: "#94A3B8",
    dashed: true,
  },
  {
    label: "Planned Cost",
    color: "#2563EB",
    dashed: false,
  },
  {
    label: "Actual Cost",
    color: "#0F766E",
    dashed: false,
  },
];

export default function DashboardBudgetChart() {
  const hasCostPressure = variance > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        height: 360,
        minHeight: 360,

        p: {
          xs: 2,
          sm: 2.5,
          md: 2.75,
        },

        borderRadius: 4,

        border: "1px solid rgba(148,163,184,.18)",

        background:
          "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",

        overflow: "hidden",

        "@media print": {
          height: 340,
          minHeight: 340,
          p: 2,
          borderRadius: 2,
          background: "#FFFFFF",
          breakInside: "avoid",
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
          mb: 1.25,
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
              lineHeight: 1.2,
              color: "#0F172A",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Budget & Cost Trend
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10,
              color: "#64748B",
              lineHeight: 1.3,
            }}
          >
            Planned vs Actual vs Approved Budget
          </Typography>
        </Box>

        {/* CURRENT ACTUAL */}

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
              letterSpacing: "-0.035em",
              color: "#0F172A",
            }}
          >
            ${current.actual}M
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 8.5,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Current Actual Cost
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          KPI SUMMARY
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3, minmax(0,1fr))",
            sm: "repeat(3, minmax(0,1fr))",
          },
          gap: 0.8,
          mb: 1.2,
        }}
      >
        {/* BUDGET */}

        <Box
          sx={{
            minWidth: 0,
            px: 1.1,
            py: 0.8,
            borderRadius: 2,
            bgcolor: "#F8FAFC",
            border: "1px solid #EEF2F7",
          }}
        >
          <Typography
            sx={{
              fontSize: 8,
              color: "#94A3B8",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            APPROVED BUDGET
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: 12,
              fontWeight: 800,
              color: "#0F172A",
              whiteSpace: "nowrap",
            }}
          >
            ${current.budget}M
          </Typography>
        </Box>

        {/* PLANNED */}

        <Box
          sx={{
            minWidth: 0,
            px: 1.1,
            py: 0.8,
            borderRadius: 2,
            bgcolor: "#EFF6FF",
            border: "1px solid #DBEAFE",
          }}
        >
          <Typography
            sx={{
              fontSize: 8,
              color: "#64748B",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            PLANNED COST
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: 12,
              fontWeight: 800,
              color: "#2563EB",
              whiteSpace: "nowrap",
            }}
          >
            ${current.planned}M
          </Typography>
        </Box>

        {/* VARIANCE */}

        <Box
          sx={{
            minWidth: 0,
            px: 1.1,
            py: 0.8,
            borderRadius: 2,
            bgcolor:
              hasCostPressure
                ? "#FEF2F2"
                : "#F0FDF4",
            border:
              hasCostPressure
                ? "1px solid #FEE2E2"
                : "1px solid #DCFCE7",
          }}
        >
          <Typography
            sx={{
              fontSize: 8,
              color: "#64748B",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            COST VARIANCE
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: 12,
              fontWeight: 800,
              color:
                hasCostPressure
                  ? "#B91C1C"
                  : "#15803D",
              whiteSpace: "nowrap",
            }}
          >
            {variance > 0 ? "+" : ""}
            {variance}M

            <Typography
              component="span"
              sx={{
                ml: 0.45,
                fontSize: 8.5,
                fontWeight: 700,
              }}
            >
              ({variancePercent.toFixed(1)}%)
            </Typography>
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
          gap: {
            xs: 1.25,
            sm: 1.8,
          },
          mb: 0.35,
          flexWrap: "wrap",
        }}
      >
        {legendItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.55,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: item.dashed ? 0 : 3,
                borderRadius: 5,
                bgcolor: item.dashed
                  ? "transparent"
                  : item.color,
                borderTop: item.dashed
                  ? `2px dashed ${item.color}`
                  : "none",
              }}
            />

            <Typography
              sx={{
                fontSize: 8.5,
                color: "#64748B",
                fontWeight: 650,
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* =====================================================
          CHART
      ===================================================== */}

      <Box
        sx={{
          height: 198,
          minWidth: 0,

          "& .recharts-wrapper": {
            overflow: "visible",
          },

          "@media print": {
            height: 185,
          },
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -24,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="budgetPlannedFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563EB"
                  stopOpacity={0.13}
                />

                <stop
                  offset="100%"
                  stopColor="#2563EB"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="budgetActualFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#0F766E"
                  stopOpacity={0.11}
                />

                <stop
                  offset="100%"
                  stopColor="#0F766E"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#E2E8F0"
              strokeDasharray="3 5"
            />

            <XAxis
              dataKey="month"
              interval={0}
              tickMargin={7}
              tick={{
                fontSize: 8.5,
                fill: "#64748B",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 8.5,
                fill: "#94A3B8",
              }}
              axisLine={false}
              tickLine={false}
              width={34}
              tickFormatter={(value) =>
                `${value}`
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
            />

            {/* APPROVED BUDGET */}

            <Area
              type="monotone"
              dataKey="budget"
              stroke="#94A3B8"
              strokeWidth={1.8}
              strokeDasharray="5 5"
              fill="none"
              dot={false}
              activeDot={{
                r: 3.5,
              }}
              animationDuration={800}
            />

            {/* PLANNED */}

            <Area
              type="monotone"
              dataKey="planned"
              stroke="#2563EB"
              strokeWidth={2.3}
              fill="url(#budgetPlannedFill)"
              dot={false}
              activeDot={{
                r: 4.5,
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1000}
            />

            {/* ACTUAL */}

            <Area
              type="monotone"
              dataKey="actual"
              stroke="#0F766E"
              strokeWidth={2.6}
              fill="url(#budgetActualFill)"
              dot={false}
              activeDot={{
                r: 4.5,
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Box
        sx={{
          mt: 0.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
            }}
          >
            Remaining: ${budgetRemaining}M
          </Typography>

          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
            }}
          >
            Utilization: {budgetUtilization.toFixed(1)}%
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 8.5,
            fontWeight: 750,
            color:
              hasCostPressure
                ? "#B91C1C"
                : "#15803D",
            whiteSpace: "nowrap",
          }}
        >
          {hasCostPressure
            ? "Actual above plan"
            : "Cost within plan"}
        </Typography>
      </Box>
    </Paper>
  );
}