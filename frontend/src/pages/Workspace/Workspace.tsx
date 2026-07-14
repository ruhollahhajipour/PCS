import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Stack,
  Breadcrumbs,
} from "@mui/material";

import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo/kgn-logo.png";

export default function Workspace() {
  const navigate = useNavigate();

  const [company] = useState("Kousha Gaman Namavar");
  const [plant] = useState("South Adish Gas Condensate Refinery");
  const [project] = useState("PCS Development");

  const cards = [
    {
      title: "Company",
      value: company,
      color: "#2563EB",
      icon: (
        <Avatar
          src={logo}
          sx={{
            width: 74,
            height: 74,
            bgcolor: "#fff",
            boxShadow: "0 20px 40px rgba(37,99,235,.25)",
          }}
        />
      ),
    },
    {
      title: "Plant",
      value: plant,
      color: "#10B981",
      icon: (
        <ApartmentRoundedIcon
          sx={{
            fontSize: 62,
            color: "#10B981",
          }}
        />
      ),
    },
    {
      title: "Project",
      value: project,
      color: "#4F46E5",
      icon: (
        <FolderRoundedIcon
          sx={{
            fontSize: 62,
            color: "#4F46E5",
          }}
        />
      ),
    },
  ];

  return (    <Box
      sx={{
        minHeight: "100%",
        width: "100%",
        p: 4,
        background: `
          radial-gradient(circle at top left,#DBEAFE 0%,transparent 40%),
          radial-gradient(circle at bottom right,#E0E7FF 0%,transparent 30%),
          linear-gradient(180deg,#F8FBFF 0%,#EEF4FB 100%)
        `,
      }}
    >
      <Breadcrumbs sx={{ mb: 2 }}>
        <HomeRoundedIcon sx={{ fontSize: 18 }} />
        <Typography color="primary">Workspace</Typography>
      </Breadcrumbs>

      <Typography
        sx={{
          fontSize: 44,
          fontWeight: 800,
          color: "#16355B",
        }}
      >
        Enterprise Workspace
      </Typography>

      <Typography
        sx={{
          color: "#64748B",
          mb: 5,
          fontSize: 17,
        }}
      >
        Select active working environment
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Grid container spacing={3}>
            {cards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: 4,
                    height: 235,
                    borderRadius: 6,
                    background: "rgba(255,255,255,.80)",
                    backdropFilter: "blur(18px)",
                    border: `2px solid ${card.color}22`,
                    boxShadow:
                      "0 25px 60px rgba(15,23,42,.08)",
                    transition: ".35s",
                    cursor: "pointer",

                    "&:hover": {
                      transform: "translateY(-10px)",
                      borderColor: card.color,
                      boxShadow:
                        "0 35px 70px rgba(37,99,235,.18)",
                    },
                  }}
                >
                  {card.icon}

                  <Typography
                    sx={{
                      mt: 3,
                      fontWeight: 700,
                      fontSize: 23,
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2,
                      color: "#64748B",
                      minHeight: 50,
                    }}
                  >
                    {card.value}
                  </Typography>

                  <Chip
                    icon={<CheckCircleRoundedIcon />}
                    label="Selected"
                    color="success"
                    sx={{ mt: 2 }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              borderRadius: 6,
              p: 4,
              height: "100%",
              background: "rgba(255,255,255,.82)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 25px 60px rgba(15,23,42,.08)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 24,
                mb: 4,
              }}
            >
              Workspace Summary
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography color="#94A3B8">Company</Typography>
                <Typography fontWeight={700}>{company}</Typography>
              </Box>

              <Box>
                <Typography color="#94A3B8">Plant</Typography>
                <Typography fontWeight={700}>{plant}</Typography>
              </Box>

              <Box>
                <Typography color="#94A3B8">Project</Typography>
                <Typography fontWeight={700}>{project}</Typography>
              </Box>              <Box>
                <Typography color="#94A3B8">Currency</Typography>
                <Typography fontWeight={700}>USD</Typography>
              </Box>

              <Box>
                <Typography color="#94A3B8">Fiscal Year</Typography>
                <Typography fontWeight={700}>2026</Typography>
              </Box>

              <Box>
                <Typography color="#94A3B8">Status</Typography>

                <Chip
                  label="ACTIVE"
                  color="success"
                />
              </Box>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                mt: 6,
                height: 58,
                borderRadius: 4,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 17,
                background:
                  "linear-gradient(90deg,#2563EB,#4F46E5)",
                boxShadow:
                  "0 18px 45px rgba(37,99,235,.35)",

                "&:hover": {
                  background:
                    "linear-gradient(90deg,#1D4ED8,#4338CA)",
                },
              }}
            >
              Enter Workspace
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          mt: 5,
          p: 4,
          borderRadius: 6,
          background: "rgba(255,255,255,.78)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 20px 45px rgba(15,23,42,.08)",
        }}
      >
        <Stack
          direction="row"
          spacing={4}
          justifyContent="space-around"
        >
          <Box textAlign="center">
            <BusinessRoundedIcon
              sx={{
                fontSize: 40,
                color: "#2563EB",
              }}
            />
            <Typography
              mt={1}
              fontWeight={700}
            >
              2 Companies
            </Typography>
          </Box>

          <Box textAlign="center">
            <ApartmentRoundedIcon
              sx={{
                fontSize: 40,
                color: "#10B981",
              }}
            />
            <Typography
              mt={1}
              fontWeight={700}
            >
              5 Plants
            </Typography>
          </Box>

          <Box textAlign="center">
            <FolderRoundedIcon
              sx={{
                fontSize: 40,
                color: "#4F46E5",
              }}
            />
            <Typography
              mt={1}
              fontWeight={700}
            >
              18 Projects
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}