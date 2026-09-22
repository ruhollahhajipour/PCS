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
  { month: "Jan", spi: 0.88 },
  { month: "Feb", spi: 0.91 },
  { month: "Mar", spi: 0.95 },
  { month: "Apr", spi: 0.97 },
  { month: "May", spi: 1.01 },
  { month: "Jun", spi: 1.03 },
  { month: "Jul", spi: 1.02 },
  { month: "Aug", spi: 1.05 },
];

const current = data[data.length - 1];

const target = 1;
const variance = current.spi - target;

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
        minWidth: 150,
        px: 1.5,
        py: 1.25,
        borderRadius: 2.5,
        bgcolor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 12px 30px rgba(15,23,42,.12)",
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 800,
          color: "#0F172A",
          mb: 0.75,
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
          SPI
        </Typography>

        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 800,
            color: value >= 1 ? "#15803D" : "#B91C1C",
          }}
        >
          {value.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}

export default function DashboardSPIChart() {
  const status =
    current.spi >= 1
      ? "Schedule on track"
      : "Schedule pressure";

  const statusColor =
    current.spi >= 1
      ? "#15803D"
      : "#B91C1C";

  const statusBg =
    current.spi >= 1
      ? "#F0FDF4"
      : "#FEF2F2";

  const statusBorder =
    current.spi >= 1
      ? "#DCFCE7"
      : "#FEE2E2";

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
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          mb: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
              lineHeight: 1.2,
              color: "#0F172A",
            }}
          >
            Schedule Performance Index
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10.5,
              color: "#64748B",
            }}
          >
            Earned Value Management
          </Typography>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            textAlign: "right",
          }}
        >
          <Typography
            sx={{
              fontSize: 23,
              lineHeight: 1,
              fontWeight: 850,
              letterSpacing: "-0.03em",
              color: statusColor,
            }}
          >
            {current.spi.toFixed(2)}
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Current SPI
          </Typography>
        </Box>
      </Box>

      {/* SUMMARY */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "1fr 1fr 1.35fr",
          },
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1,
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
              fontSize: 12,
              fontWeight: 800,
              color: "#475569",
            }}
          >
            1.00
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1,
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
              fontSize: 12,
              fontWeight: 800,
              color:
                variance >= 0
                  ? "#15803D"
                  : "#B91C1C",
            }}
          >
            {variance >= 0 ? "+" : ""}
            {variance.toFixed(2)}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: statusBg,
            border: `1px solid ${statusBorder}`,
            gridColumn: {
              xs: "1 / -1",
              sm: "auto",
            },
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
              fontSize: 11.5,
              fontWeight: 800,
              color: statusColor,
            }}
          >
            {status}
          </Typography>
        </Box>
      </Box>

      {/* CHART */}

      <Box
        sx={{
          height: 205,
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
              domain={[0.8, 1.1]}
              tick={{
                fontSize: 9,
                fill: "#94A3B8",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                Number(value).toFixed(1)
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#CBD5E1",
                strokeDasharray: "4 4",
              }}
            />

            <ReferenceLine
              y={1}
              stroke="#CBD5E1"
              strokeDasharray="4 4"
            />

            <Line
              type="monotone"
              dataKey="spi"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
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
          SPI = EV / PV
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,
            color: statusColor,
            whiteSpace: "nowrap",
          }}
        >
          {current.spi >= 1
            ? "Ahead of schedule"
            : "Behind schedule"}
        </Typography>
      </Box>
    </Paper>
  );
}