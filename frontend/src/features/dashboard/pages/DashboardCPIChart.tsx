import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

const data = [
  { month: "Jan", cpi: 0.92 },
  { month: "Feb", cpi: 0.95 },
  { month: "Mar", cpi: 0.97 },
  { month: "Apr", cpi: 1.01 },
  { month: "May", cpi: 1.03 },
  { month: "Jun", cpi: 1.05 },
  { month: "Jul", cpi: 1.02 },
  { month: "Aug", cpi: 1.04 },
];

const current = data[data.length - 1];

const TARGET = 1;

const variance = current.cpi - TARGET;

const getStatus = (value: number) => {
  if (value >= 1.05) {
    return {
      label: "Cost Efficient",
      shortLabel: "Efficient",
      color: "#15803D",
      background: "#F0FDF4",
      border: "#DCFCE7",
    };
  }

  if (value >= 1) {
    return {
      label: "Cost Controlled",
      shortLabel: "Controlled",
      color: "#2563EB",
      background: "#EFF6FF",
      border: "#DBEAFE",
    };
  }

  return {
    label: "Cost Pressure",
    shortLabel: "Attention",
    color: "#B91C1C",
    background: "#FEF2F2",
    border: "#FEE2E2",
  };
};

const status = getStatus(current.cpi);

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

  const value = Number(payload[0]?.value ?? 0);

  const tooltipStatus = getStatus(value);

  return (
    <Box
      sx={{
        minWidth: 175,
        px: 1.5,
        py: 1.35,
        borderRadius: 2.5,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 14px 32px rgba(15,23,42,.14)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 800,
            color: "#0F172A",
          }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            px: 0.7,
            py: 0.25,
            borderRadius: 1,
            bgcolor: tooltipStatus.background,
            border: `1px solid ${tooltipStatus.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 8,
              fontWeight: 750,
              color: tooltipStatus.color,
            }}
          >
            {tooltipStatus.shortLabel}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
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
              bgcolor: "#0F766E",
            }}
          />

          <Typography
            sx={{
              fontSize: 9.5,
              color: "#64748B",
            }}
          >
            CPI
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 850,
            color: tooltipStatus.color,
          }}
        >
          {value.toFixed(2)}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 1,
          pt: 0.9,
          borderTop: "1px solid #EEF2F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: 8.5,
            color: "#94A3B8",
          }}
        >
          Target
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,
            color: "#475569",
          }}
        >
          1.00
        </Typography>
      </Box>
    </Box>
  );
}

export default function DashboardCPIChart() {
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
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 1.35,
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
              fontSize: 10.5,
              lineHeight: 1.3,
              color: "#64748B",
            }}
          >
            Cost Performance Index
          </Typography>
        </Box>

        {/* CURRENT CPI */}

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
              color: status.color,
            }}
          >
            {current.cpi.toFixed(2)}
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Current CPI
          </Typography>
        </Box>
      </Box>

      {/* KPI SUMMARY */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: {
            xs: 0.75,
            sm: 1,
          },
          mb: 1.25,
        }}
      >
        {/* TARGET */}

        <Box
          sx={{
            minWidth: 0,
            p: {
              xs: 0.85,
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
            TARGET
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
            }}
          >
            1.00
          </Typography>
        </Box>

        {/* VARIANCE */}

        <Box
          sx={{
            minWidth: 0,
            p: {
              xs: 0.85,
              sm: 1,
            },
            borderRadius: 2,
            bgcolor:
              variance >= 0
                ? "#F0FDF4"
                : "#FEF2F2",
            border:
              variance >= 0
                ? "1px solid #DCFCE7"
                : "1px solid #FEE2E2",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
              fontWeight: 650,
            }}
          >
            VARIANCE
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: 11,
                sm: 12,
              },
              fontWeight: 800,
              color:
                variance >= 0
                  ? "#15803D"
                  : "#B91C1C",
              whiteSpace: "nowrap",
            }}
          >
            {variance >= 0 ? "+" : ""}
            {variance.toFixed(2)}
          </Typography>
        </Box>

        {/* STATUS */}

        <Box
          sx={{
            minWidth: 0,
            p: {
              xs: 0.85,
              sm: 1,
            },
            borderRadius: 2,
            bgcolor: status.background,
            border: `1px solid ${status.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
              fontWeight: 650,
            }}
          >
            STATUS
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: 10,
                sm: 11,
              },
              fontWeight: 800,
              color: status.color,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {status.label}
          </Typography>
        </Box>
      </Box>

      {/* LEGEND */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 0.5,
        }}
      >
        <Box
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
              bgcolor: "#0F766E",
            }}
          />

          <Typography
            sx={{
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            CPI
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 0,
              borderTop: "1px dashed #CBD5E1",
            }}
          />

          <Typography
            sx={{
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Target 1.00
          </Typography>
        </Box>
      </Box>

      {/* CHART */}

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
          <LineChart
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
              domain={[0.8, 1.2]}
              tickCount={5}
              tick={{
                fontSize: 9,
                fill: "#94A3B8",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                Number(value).toFixed(2)
              }
              width={36}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
            />

            {/* TARGET LINE */}

            <ReferenceLine
              y={TARGET}
              stroke="#CBD5E1"
              strokeWidth={1.2}
              strokeDasharray="5 5"
            />

            {/* CPI */}

            <Line
              type="monotone"
              dataKey="cpi"
              stroke="#0F766E"
              strokeWidth={2.6}
              dot={{
                r: 3,
                fill: "#0F766E",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 5,
                fill: "#0F766E",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* FOOTER */}

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
          CPI = EV ÷ AC
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,
            color: status.color,
            whiteSpace: "nowrap",
          }}
        >
          {current.cpi >= 1
            ? "Cost under control"
            : "Cost requires attention"}
        </Typography>
      </Box>
    </Paper>
  );
}