import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";

import {
  CheckCircleRounded,
  EngineeringRounded,
  ShoppingCartRounded,
  ConstructionRounded,
  PlayCircleOutlineRounded,
} from "@mui/icons-material";

const stages = [
  {
    label: "Engineering",
    value: 86,
    icon: <EngineeringRounded sx={{ fontSize: 17 }} />,
  },
  {
    label: "Procurement",
    value: 71,
    icon: <ShoppingCartRounded sx={{ fontSize: 17 }} />,
  },
  {
    label: "Construction",
    value: 68,
    icon: <ConstructionRounded sx={{ fontSize: 17 }} />,
  },
  {
    label: "Commissioning",
    value: 42,
    icon: <PlayCircleOutlineRounded sx={{ fontSize: 17 }} />,
  },
];

export default function DashboardProjectStatus() {
  return (
    <Paper
      elevation={0}
      sx={{
        height: 380,
        minHeight: 380,
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
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1.2,
            }}
          >
            Project Status
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 11,
              color: "#64748B",
            }}
          >
            Overall execution health
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            px: 1,
            py: 0.55,
            borderRadius: 2,
            bgcolor: "#ECFDF5",
            color: "#15803D",
          }}
        >
          <CheckCircleRounded sx={{ fontSize: 15 }} />

          <Typography
            sx={{
              fontSize: 9.5,
              fontWeight: 800,
            }}
          >
            ON TRACK
          </Typography>
        </Box>
      </Box>

      {/* MAIN PROGRESS */}

      <Box
        sx={{
          p: 1.75,
          borderRadius: 3,
          bgcolor: "#F8FAFC",
          border: "1px solid #EEF2F7",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                color: "#64748B",
                fontWeight: 650,
              }}
            >
              Overall Progress
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: 30,
                lineHeight: 1,
                fontWeight: 850,
                letterSpacing: "-0.035em",
                color: "#0F172A",
              }}
            >
              74%
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography
              sx={{
                fontSize: 9,
                color: "#94A3B8",
              }}
            >
              Target
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                color: "#2563EB",
              }}
            >
              76%
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={74}
          sx={{
            height: 8,
            borderRadius: 10,
            bgcolor: "#E2E8F0",

            "& .MuiLinearProgress-bar": {
              borderRadius: 10,
              bgcolor: "#2563EB",
            },
          }}
        />

        <Box
          sx={{
            mt: 0.7,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: 9,
              color: "#94A3B8",
            }}
          >
            Current
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#64748B",
              fontWeight: 650,
            }}
          >
            -2.0% vs target
          </Typography>
        </Box>
      </Box>

      {/* STAGES */}

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 800,
          color: "#1E293B",
          mb: 1.25,
        }}
      >
        Execution by Phase
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.15,
        }}
      >
        {stages.map((stage) => (
          <Box key={stage.label}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.45,
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
                    width: 25,
                    height: 25,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#EFF6FF",
                    color: "#2563EB",
                  }}
                >
                  {stage.icon}
                </Box>

                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 650,
                    color: "#475569",
                  }}
                >
                  {stage.label}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: "#0F172A",
                }}
              >
                {stage.value}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={stage.value}
              sx={{
                height: 5,
                borderRadius: 10,
                bgcolor: "#E2E8F0",

                "& .MuiLinearProgress-bar": {
                  borderRadius: 10,
                  bgcolor:
                    stage.value >= 80
                      ? "#16A34A"
                      : stage.value >= 60
                      ? "#2563EB"
                      : "#D97706",
                },
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider
        sx={{
          my: 1.6,
          borderColor: "#E2E8F0",
        }}
      />

      {/* FOOTER STATUS */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 9,
              color: "#94A3B8",
            }}
          >
            Last update
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: "#475569",
            }}
          >
            29 Aug 2026 • 09:45
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1,
            py: 0.55,
            borderRadius: 1.5,
            bgcolor: "#F1F5F9",
          }}
        >
          <Typography
            sx={{
              fontSize: 9,
              fontWeight: 750,
              color: "#64748B",
            }}
          >
            4 PHASES
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}