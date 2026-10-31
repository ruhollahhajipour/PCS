import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const data = [
  { name: "Available", value: 68 },
  { name: "Reserved", value: 22 },
  { name: "Consumed", value: 10 },
];

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
];

const total = data.reduce(
  (sum, item) => sum + item.value,
  0
);

const available =
  data.find((item) => item.name === "Available")?.value ?? 0;

const reserved =
  data.find((item) => item.name === "Reserved")?.value ?? 0;

const consumed =
  data.find((item) => item.name === "Consumed")?.value ?? 0;

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: {
      name?: string;
    };
  }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

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
        {item.name ?? item.payload?.name}
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
          Stock
        </Typography>

        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 800,
            color: "#0F172A",
          }}
        >
          {item.value ?? 0}%
        </Typography>
      </Box>
    </Box>
  );
}

export default function DashboardWarehouseChart() {
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
          mb: 1.25,
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
            Warehouse Status
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10.5,
              color: "#64748B",
            }}
          >
            Material availability & utilization
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
            {available}%
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Available
          </Typography>
        </Box>
      </Box>

      {/* CHART AREA */}

      <Box
        sx={{
          position: "relative",
          height: 205,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="76%"
              paddingAngle={3}
              stroke="#FFFFFF"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              animationDuration={900}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip />}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER VALUE */}

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: 24,
              lineHeight: 1,
              fontWeight: 850,
              letterSpacing: "-0.04em",
              color: "#0F172A",
            }}
          >
            {total}%
          </Typography>

          <Typography
            sx={{
              mt: 0.45,
              fontSize: 8.5,
              fontWeight: 650,
              color: "#94A3B8",
            }}
          >
            STOCK STATUS
          </Typography>
        </Box>
      </Box>

      {/* STATUS SUMMARY */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: 0.8,
          mt: 0.2,
        }}
      >
        {[
          {
            name: "Available",
            value: available,
            color: "#2563EB",
            background: "#EFF6FF",
          },
          {
            name: "Reserved",
            value: reserved,
            color: "#10B981",
            background: "#ECFDF5",
          },
          {
            name: "Consumed",
            value: consumed,
            color: "#F59E0B",
            background: "#FFFBEB",
          },
        ].map((item) => (
          <Box
            key={item.name}
            sx={{
              minWidth: 0,
              p: 0.85,
              borderRadius: 1.8,
              bgcolor: item.background,
              border: "1px solid rgba(148,163,184,.12)",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: item.color,
                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  fontSize: 8,
                  color: "#64748B",
                  fontWeight: 650,
                }}
              >
                {item.name}
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: 11.5,
                color: "#1E293B",
                fontWeight: 800,
              }}
            >
              {item.value}%
            </Typography>
          </Box>
        ))}
      </Box>

      {/* FOOTER */}

      <Box
        sx={{
          mt: 1,
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
          Total stock allocation
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,
            color:
              available >= 60
                ? "#15803D"
                : "#B91C1C",
          }}
        >
          {available >= 60
            ? "Healthy availability"
            : "Low availability"}
        </Typography>
      </Box>
    </Paper>
  );
}