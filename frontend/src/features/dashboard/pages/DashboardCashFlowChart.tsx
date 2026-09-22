import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", inflow: 22, outflow: 18, balance: 4 },
  { month: "Feb", inflow: 28, outflow: 23, balance: 5 },
  { month: "Mar", inflow: 32, outflow: 29, balance: 3 },
  { month: "Apr", inflow: 35, outflow: 31, balance: 4 },
  { month: "May", inflow: 38, outflow: 34, balance: 4 },
  { month: "Jun", inflow: 42, outflow: 37, balance: 5 },
  { month: "Jul", inflow: 46, outflow: 41, balance: 5 },
  { month: "Aug", inflow: 52, outflow: 46, balance: 6 },
];

const current = data[data.length - 1];

const netCashFlow =
  current.inflow - current.outflow;

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
    inflow: "Cash Inflow",
    outflow: "Cash Outflow",
    balance: "Net Balance",
  };

  const units: Record<string, string> = {
    inflow: "$M",
    outflow: "$M",
    balance: "$M",
  };

  return (
    <Box
      sx={{
        minWidth: 170,
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow:
          "0 12px 30px rgba(15,23,42,.12)",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 800,
          color: "#0F172A",
          mb: 1,
        }}
      >
        {label}
      </Typography>

      {payload.map((item) => (
        <Box
          key={item.dataKey}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 0.55,
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
                  item.dataKey === "inflow"
                    ? "#2563EB"
                    : item.dataKey === "outflow"
                    ? "#D97706"
                    : "#0F766E",
              }}
            />

            <Typography
              sx={{
                fontSize: 10,
                color: "#64748B",
              }}
            >
              {labels[item.dataKey ?? ""] ??
                item.dataKey}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 750,
              color: "#0F172A",
              whiteSpace: "nowrap",
            }}
          >
            ${item.value}
            {units[item.dataKey ?? ""]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

const legendItems = [
  {
    label: "Inflow",
    color: "#2563EB",
  },
  {
    label: "Outflow",
    color: "#D97706",
  },
  {
    label: "Net Balance",
    color: "#0F766E",
  },
];

export default function DashboardCashFlowChart() {
  const positiveBalance = netCashFlow >= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        height: {
          xs: "auto",
          sm: 360,
        },

        minHeight: {
          xs: 360,
          sm: 360,
        },

        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
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

              lineHeight: 1.2,

              fontWeight: 800,

              color: "#0F172A",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Cash Flow
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10.5,
              color: "#64748B",
              lineHeight: 1.3,
            }}
          >
            Monthly cash movement
          </Typography>
        </Box>

        {/* CURRENT NET */}

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

              color: positiveBalance
                ? "#15803D"
                : "#B91C1C",
            }}
          >
            {netCashFlow > 0
              ? "+"
              : ""}
            ${netCashFlow}M
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Current Net Flow
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
        {/* INFLOW */}

        <Box
          sx={{
            minWidth: 0,

            p: {
              xs: 0.9,
              sm: 1,
            },

            borderRadius: 2,

            bgcolor: "#EFF6FF",

            border:
              "1px solid #DBEAFE",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            INFLOW
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
            ${current.inflow}M
          </Typography>
        </Box>

        {/* OUTFLOW */}

        <Box
          sx={{
            minWidth: 0,

            p: {
              xs: 0.9,
              sm: 1,
            },

            borderRadius: 2,

            bgcolor: "#FFF7ED",

            border:
              "1px solid #FFEDD5",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            OUTFLOW
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: 11,
                sm: 12,
              },
              fontWeight: 800,
              color: "#D97706",
              whiteSpace: "nowrap",
            }}
          >
            ${current.outflow}M
          </Typography>
        </Box>

        {/* NET */}

        <Box
          sx={{
            minWidth: 0,

            p: {
              xs: 0.9,
              sm: 1,
            },

            borderRadius: 2,

            bgcolor: positiveBalance
              ? "#F0FDF4"
              : "#FEF2F2",

            border: positiveBalance
              ? "1px solid #DCFCE7"
              : "1px solid #FEE2E2",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            NET
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: 11,
                sm: 12,
              },
              fontWeight: 800,

              color: positiveBalance
                ? "#15803D"
                : "#B91C1C",

              whiteSpace: "nowrap",
            }}
          >
            {netCashFlow > 0
              ? "+"
              : ""}
            ${netCashFlow}M
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
            xs: 1.5,
            sm: 2,
          },

          mb: 0.5,

          flexWrap: "wrap",
        }}
      >
        {legendItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 3,
                borderRadius: 5,
                bgcolor: item.color,
                flexShrink: 0,
              }}
            />

            <Typography
              sx={{
                fontSize: 9,
                color: "#64748B",
                fontWeight: 650,
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
          <ComposedChart
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
                fill: "rgba(148,163,184,.06)",
              }}
            />

            {/* INFLOW */}

            <Bar
              dataKey="inflow"
              fill="#2563EB"
              radius={[5, 5, 0, 0]}
              barSize={14}
              animationDuration={850}
            />

            {/* OUTFLOW */}

            <Bar
              dataKey="outflow"
              fill="#D97706"
              radius={[5, 5, 0, 0]}
              barSize={14}
              animationDuration={950}
            />

            {/* NET BALANCE */}

            <Line
              type="monotone"
              dataKey="balance"
              stroke="#0F766E"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
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
          mt: 0.4,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 1,

          flexWrap: {
            xs: "wrap",
            sm: "nowrap",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 9,
            color: "#94A3B8",
          }}
        >
          Net Flow = Inflow − Outflow
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,

            color: positiveBalance
              ? "#15803D"
              : "#B91C1C",

            whiteSpace: "nowrap",
          }}
        >
          {positiveBalance
            ? "Positive cash position"
            : "Cash pressure"}
        </Typography>
      </Box>
    </Paper>
  );
}