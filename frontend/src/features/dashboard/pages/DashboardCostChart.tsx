import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

const data = [
  { month: "Jan", pv: 120, ev: 108, ac: 110 },
  { month: "Feb", pv: 180, ev: 162, ac: 165 },
  { month: "Mar", pv: 240, ev: 228, ac: 220 },
  { month: "Apr", pv: 300, ev: 285, ac: 295 },
  { month: "May", pv: 360, ev: 342, ac: 338 },
  { month: "Jun", pv: 430, ev: 408, ac: 410 },
  { month: "Jul", pv: 510, ev: 474, ac: 482 },
  { month: "Aug", pv: 590, ev: 545, ac: 560 },
];

const current = data[data.length - 1];

const cpi =
  current.ac !== 0
    ? current.ev / current.ac
    : 0;

const costVariance =
  current.ev - current.ac;

const costVariancePercent =
  current.ac !== 0
    ? (costVariance / current.ac) * 100
    : 0;

const isCostEfficient = cpi >= 1;

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
    pv: "Planned Value",
    ev: "Earned Value",
    ac: "Actual Cost",
  };

  const colors: Record<string, string> = {
    pv: "#2563EB",
    ev: "#7C3AED",
    ac: "#0F766E",
  };

  const ev =
    payload.find(
      (item) => item.dataKey === "ev"
    )?.value ?? 0;

  const ac =
    payload.find(
      (item) => item.dataKey === "ac"
    )?.value ?? 0;

  const monthlyCV =
    Number(ev) - Number(ac);

  return (
    <Box
      sx={{
        minWidth: 190,
        px: 1.5,
        py: 1.35,
        borderRadius: 2.5,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow:
          "0 14px 35px rgba(15,23,42,.14)",
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
                  bgcolor:
                    colors[key] ?? "#64748B",
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
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            color: "#64748B",
          }}
        >
          Cost Variance
        </Typography>

        <Typography
          sx={{
            fontSize: 9.5,
            fontWeight: 800,
            color:
              monthlyCV >= 0
                ? "#15803D"
                : "#B91C1C",
          }}
        >
          {monthlyCV > 0 ? "+" : ""}
          {monthlyCV}M
        </Typography>
      </Box>
    </Box>
  );
}

const legendItems = [
  {
    label: "PV",
    description: "Planned Value",
    color: "#2563EB",
    type: "line",
  },
  {
    label: "EV",
    description: "Earned Value",
    color: "#7C3AED",
    type: "line",
  },
  {
    label: "AC",
    description: "Actual Cost",
    color: "#0F766E",
    type: "line",
  },
];

export default function DashboardCostChart() {
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

        border:
          "1px solid rgba(148,163,184,.18)",

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
            Cost Performance
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10,
              color: "#64748B",
              lineHeight: 1.3,
            }}
          >
            Earned Value Management
          </Typography>
        </Box>

        {/* CPI */}

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
              color: isCostEfficient
                ? "#15803D"
                : "#B91C1C",
            }}
          >
            {cpi.toFixed(2)}
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 8.5,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Current CPI
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          KPI SUMMARY
      ===================================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0,1fr))",
          gap: 0.8,
          mb: 1.2,
        }}
      >
        {/* PV */}

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
            PLANNED VALUE
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
            ${current.pv}M
          </Typography>
        </Box>

        {/* EV */}

        <Box
          sx={{
            minWidth: 0,
            px: 1.1,
            py: 0.8,
            borderRadius: 2,
            bgcolor: "#F5F3FF",
            border: "1px solid #EDE9FE",
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
            EARNED VALUE
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: 12,
              fontWeight: 800,
              color: "#7C3AED",
              whiteSpace: "nowrap",
            }}
          >
            ${current.ev}M
          </Typography>
        </Box>

        {/* CV */}

        <Box
          sx={{
            minWidth: 0,
            px: 1.1,
            py: 0.8,
            borderRadius: 2,
            bgcolor:
              costVariance >= 0
                ? "#F0FDF4"
                : "#FEF2F2",
            border:
              costVariance >= 0
                ? "1px solid #DCFCE7"
                : "1px solid #FEE2E2",
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
                costVariance >= 0
                  ? "#15803D"
                  : "#B91C1C",
              whiteSpace: "nowrap",
            }}
          >
            {costVariance > 0 ? "+" : ""}
            {costVariance}M

            <Typography
              component="span"
              sx={{
                ml: 0.45,
                fontSize: 8.5,
                fontWeight: 700,
              }}
            >
              ({costVariancePercent.toFixed(1)}%)
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
                height: 3,
                borderRadius: 5,
                bgcolor: item.color,
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
          <ComposedChart
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
                id="evmActualFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#7C3AED"
                  stopOpacity={0.12}
                />

                <stop
                  offset="100%"
                  stopColor="#7C3AED"
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
              width={34}
              tick={{
                fontSize: 8.5,
                fill: "#94A3B8",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
            />

            {/* CURRENT EV REFERENCE */}

            <ReferenceLine
              y={current.ev}
              stroke="#CBD5E1"
              strokeDasharray="4 4"
            />

            {/* EV */}

            <Area
              type="monotone"
              dataKey="ev"
              stroke="#7C3AED"
              strokeWidth={2.5}
              fill="url(#evmActualFill)"
              dot={false}
              activeDot={{
                r: 4.5,
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1000}
            />

            {/* PV */}

            <Line
              type="monotone"
              dataKey="pv"
              stroke="#2563EB"
              strokeWidth={2.2}
              dot={false}
              activeDot={{
                r: 4,
              }}
              animationDuration={850}
            />

            {/* AC */}

            <Line
              type="monotone"
              dataKey="ac"
              stroke="#0F766E"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4.5,
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1100}
            />
          </ComposedChart>
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
            CPI = EV ÷ AC
          </Typography>

          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
            }}
          >
            CV = EV − AC
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 8.5,
            fontWeight: 750,
            color: isCostEfficient
              ? "#15803D"
              : "#B91C1C",
            whiteSpace: "nowrap",
          }}
        >
          {isCostEfficient
            ? "Cost efficient"
            : "Cost pressure"}
        </Typography>
      </Box>
    </Paper>
  );
}