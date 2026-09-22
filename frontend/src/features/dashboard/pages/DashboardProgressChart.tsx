import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const PROGRESS = 74;

const data = [
  {
    name: "Progress",
    value: PROGRESS,
    fill: "#2563EB",
  },
];

export default function DashboardProgressChart() {
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
        <Box sx={{ minWidth: 0 }}>
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
            Project Progress
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: 10.5,
              lineHeight: 1.3,
              color: "#64748B",
            }}
          >
            Overall completion status
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
            {PROGRESS}%
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            Overall Progress
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
          mb: 0.75,
        }}
      >
        {/* PLANNED */}

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
            PLANNED
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
            78%
          </Typography>
        </Box>

        {/* ACTUAL */}

        <Box
          sx={{
            minWidth: 0,
            p: {
              xs: 0.85,
              sm: 1,
            },
            borderRadius: 2,
            bgcolor: "#EFF6FF",
            border: "1px solid #DBEAFE",
          }}
        >
          <Typography
            sx={{
              fontSize: 8.5,
              color: "#94A3B8",
              fontWeight: 650,
            }}
          >
            ACTUAL
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
            }}
          >
            {PROGRESS}%
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
            bgcolor: "#FEF2F2",
            border: "1px solid #FEE2E2",
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
              color: "#B91C1C",
            }}
          >
            -4%
          </Typography>
        </Box>
      </Box>

      {/* PROGRESS VISUAL */}

      <Box
        sx={{
          position: "relative",
          height: 205,
          minWidth: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          "& .recharts-wrapper": {
            overflow: "visible",
          },
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <RadialBarChart
            data={data}
            innerRadius="68%"
            outerRadius="88%"
            startAngle={90}
            endAngle={-270}
            cx="50%"
            cy="50%"
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />

            <RadialBar
              dataKey="value"
              background={{
                fill: "#E2E8F0",
              }}
              cornerRadius={12}
              isAnimationActive
              animationDuration={900}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* CENTER */}

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 34,
                sm: 38,
              },
              lineHeight: 1,
              fontWeight: 850,
              letterSpacing: "-0.04em",
              color: "#0F172A",
            }}
          >
            {PROGRESS}%
          </Typography>

          <Typography
            sx={{
              mt: 0.65,
              fontSize: 9.5,
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.02em",
            }}
          >
            COMPLETED
          </Typography>
        </Box>
      </Box>

      {/* FOOTER */}

      <Box
        sx={{
          mt: 0.25,
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
          Project completion
        </Typography>

        <Typography
          sx={{
            fontSize: 9,
            fontWeight: 750,
            color: "#2563EB",
            whiteSpace: "nowrap",
          }}
        >
          {PROGRESS >= 75
            ? "Progress on track"
            : "Progress requires attention"}
        </Typography>
      </Box>
    </Paper>
  );
}