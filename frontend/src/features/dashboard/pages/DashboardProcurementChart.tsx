import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";

const data = [
  { stage: "PR", value: 42 },
  { stage: "RFQ", value: 35 },
  { stage: "Bid", value: 28 },
  { stage: "PO", value: 19 },
  { stage: "Delivered", value: 12 },
];

const COLORS = [
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE",
];

const total = data[0]?.value ?? 0;

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

  return (
    <Box
      sx={{
        minWidth: 145,
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
          mb: 0.8,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
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
          Items
        </Typography>

        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 800,
            color: "#2563EB",
          }}
        >
          {payload[0]?.value ?? 0}
        </Typography>
      </Box>
    </Box>
  );
}

export default function DashboardProcurementChart() {
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
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
              lineHeight: 1.25,
              color: "#0F172A",
            }}
          >
            Procurement Pipeline
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10.5,
              color: "#64748B",
            }}
          >
            Current procurement status
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
              fontSize: 21,
              lineHeight: 1,
              fontWeight: 850,
              letterSpacing: "-0.03em",
              color: "#2563EB",
            }}
          >
            {total}
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Active PRs
          </Typography>
        </Box>
      </Box>

      {/* SUMMARY */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 0.8,
          mb: 1.25,
        }}
      >
        {[
          {
            label: "PR",
            value: 42,
          },
          {
            label: "RFQ",
            value: 35,
          },
          {
            label: "PO",
            value: 19,
          },
          {
            label: "Delivered",
            value: 12,
          },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              minWidth: 0,
              p: 0.85,
              borderRadius: 1.8,
              bgcolor: "#F8FAFC",
              border: "1px solid #EEF2F7",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 8,
                color: "#94A3B8",
                fontWeight: 650,
              }}
            >
              {item.label}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: 11.5,
                color: "#1E293B",
                fontWeight: 800,
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* LEGEND */}

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
          Procurement Items
        </Typography>
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
              dataKey="stage"
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
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "rgba(37,99,235,.045)",
              }}
            />

            <Bar
              dataKey="value"
              radius={[7, 7, 2, 2]}
              maxBarSize={42}
              animationDuration={900}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}
            </Bar>
          </BarChart>
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
          PR → RFQ → Bid → PO → Delivery
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,
            color: "#2563EB",
          }}
        >
          Pipeline active
        </Typography>
      </Box>
    </Paper>
  );
}