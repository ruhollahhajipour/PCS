import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  PeopleRounded,
  SecurityRounded,
  TuneRounded,
  HistoryRounded,
  StorageRounded,
  BusinessRounded,
  AdminPanelSettingsRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

type AdministrationItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: string;
  path?: string;
  accent: string;
};

const administrationItems: AdministrationItem[] = [
  {
    title: "Users",
    description:
      "Manage user accounts, profiles, status and organizational access.",
    icon: <PeopleRounded />,
    status: "User Management",
    path: "/administration/users",
    accent: "#2563EB",
  },
  {
    title: "Roles & Permissions",
    description:
      "Define roles, permissions and access policies across PCS.",
    icon: <SecurityRounded />,
    status: "Access Control",
    path: "/administration/roles",
    accent: "#4F46E5",
  },
  {
    title: "Organization",
    description:
      "Manage companies, plants, departments and organizational structure.",
    icon: <BusinessRounded />,
    status: "Organization",
    path: "/administration/organization",
    accent: "#0891B2",
  },
  {
    title: "System Configuration",
    description:
      "Configure global system behavior and application-level parameters.",
    icon: <TuneRounded />,
    status: "System",
    path: "/administration/configuration",
    accent: "#7C3AED",
  },
  {
    title: "Audit Log",
    description:
      "Review important system activities and administrative events.",
    icon: <HistoryRounded />,
    status: "Security",
    path: "/administration/audit-log",
    accent: "#D97706",
  },
  {
    title: "Database & Backup",
    description:
      "Manage database information, backup policies and data protection.",
    icon: <StorageRounded />,
    status: "Data Management",
    path: "/administration/database",
    accent: "#059669",
  },
];


export default function Administration() {
  const navigate = useNavigate();

  const handleOpen = (item: AdministrationItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1500,
        mx: "auto",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 2,
          md: 3,
        },
      }}
    >

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
        >

          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
              color: "#FFFFFF",
              boxShadow:
                "0 10px 28px rgba(37,99,235,.22)",
            }}
          >
            <AdminPanelSettingsRounded
              sx={{
                fontSize: 29,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  md: 30,
                },
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "#0F172A",
              }}
            >
              Administration
            </Typography>

            <Typography
              sx={{
                mt: 0.65,
                fontSize: 13,
                color: "#64748B",
                fontWeight: 500,
              }}
            >
              System, organization and access management
            </Typography>
          </Box>

        </Stack>
      </Box>


      {/* =====================================================
          ADMINISTRATION SUMMARY
      ===================================================== */}

      <Card
        elevation={0}
        sx={{
          mb: 3.5,
          borderRadius: 3,
          border:
            "1px solid rgba(226,232,240,.9)",
          background:
            "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
          boxShadow:
            "0 8px 28px rgba(15,23,42,.055)",
          overflow: "hidden",
          position: "relative",

          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: 4,
            height: "100%",
            background:
              "linear-gradient(180deg, #2563EB, #4F46E5)",
          },
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              md: 3,
            },
            "&:last-child": {
              pb: {
                xs: 2.5,
                md: 3,
              },
            },
          }}
        >

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            alignItems={{
              xs: "flex-start",
              md: "center",
            }}
            justifyContent="space-between"
            spacing={2}
          >

            <Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#1E293B",
                }}
              >
                System Administration
              </Typography>

              <Typography
                sx={{
                  mt: 0.6,
                  fontSize: 12.5,
                  lineHeight: 1.7,
                  color: "#64748B",
                  maxWidth: 720,
                }}
              >
                Centralized administration of PCS users, permissions,
                organization structure, system configuration and data
                management.
              </Typography>
            </Box>

            <Chip
              icon={
                <AdminPanelSettingsRounded
                  sx={{
                    fontSize: 16,
                  }}
                />
              }
              label="Administrator Area"
              size="small"
              sx={{
                height: 30,
                borderRadius: 1.8,
                bgcolor: "rgba(37,99,235,.08)",
                color: "#2563EB",
                border:
                  "1px solid rgba(37,99,235,.12)",
                fontSize: 11,
                fontWeight: 700,

                "& .MuiChip-icon": {
                  color: "#2563EB",
                },
              }}
            />

          </Stack>

        </CardContent>
      </Card>


      {/* =====================================================
          MODULES
      ===================================================== */}

      <Typography
        sx={{
          mb: 1.5,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#64748B",
        }}
      >
        Administration Modules
      </Typography>


      <Grid
        container
        spacing={{
          xs: 2,
          md: 2.5,
        }}
      >

        {administrationItems.map((item) => (

          <Grid
            key={item.title}
            size={{
              xs: 12,
              sm: 6,
              lg: 4,
            }}
          >

            <Card
              onClick={() => handleOpen(item)}
              elevation={0}
              sx={{
                height: "100%",
                minHeight: 205,
                cursor: "pointer",
                borderRadius: 3,
                border:
                  "1px solid #E2E8F0",
                background:
                  "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
                position: "relative",
                overflow: "hidden",
                transition:
                  "transform .22s ease, box-shadow .22s ease, border-color .22s ease",

                "&:hover": {
                  transform:
                    "translateY(-5px)",
                  borderColor:
                    "rgba(37,99,235,.22)",
                  boxShadow:
                    "0 16px 38px rgba(15,23,42,.10)",

                  "& .admin-arrow": {
                    transform:
                      "translateX(4px)",
                    opacity: 1,
                  },

                  "& .admin-icon": {
                    transform:
                      "scale(1.06)",
                  },
                },

                "&:after": {
                  content: '""',
                  position: "absolute",
                  right: -35,
                  bottom: -45,
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  background:
                    `radial-gradient(circle, ${item.accent}14 0%, transparent 70%)`,
                  pointerEvents: "none",
                },
              }}
            >

              <CardContent
                sx={{
                  p: 2.75,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  zIndex: 1,

                  "&:last-child": {
                    pb: 2.75,
                  },
                }}
              >

                {/* Icon */}

                <Box
                  className="admin-icon"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    color: item.accent,
                    bgcolor:
                      `${item.accent}10`,
                    border:
                      `1px solid ${item.accent}18`,
                    transition:
                      "transform .22s ease",

                    "& svg": {
                      fontSize: 25,
                    },
                  }}
                >
                  {item.icon}
                </Box>


                {/* Status */}

                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    height: 22,
                    mb: 1.2,
                    borderRadius: 1.3,
                    bgcolor:
                      `${item.accent}09`,
                    color: item.accent,
                    border:
                      `1px solid ${item.accent}15`,
                    fontSize: 9.5,
                    fontWeight: 700,

                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />


                {/* Title */}

                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#1E293B",
                    lineHeight: 1.25,
                  }}
                >
                  {item.title}
                </Typography>


                {/* Description */}

                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: 11.5,
                    lineHeight: 1.65,
                    color: "#64748B",
                    maxWidth: 360,
                  }}
                >
                  {item.description}
                </Typography>


                {/* Arrow */}

                <Box
                  className="admin-arrow"
                  sx={{
                    mt: "auto",
                    pt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    color: item.accent,
                    opacity: 0.55,
                    transition:
                      "transform .22s ease, opacity .22s ease",
                  }}
                >
                  <ArrowForwardRounded
                    sx={{
                      fontSize: 19,
                    }}
                  />
                </Box>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>


      {/* =====================================================
          SECURITY NOTE
      ===================================================== */}

      <Box
        sx={{
          mt: 3.5,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: "#F8FAFC",
          border:
            "1px solid #E2E8F0",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >

          <SecurityRounded
            sx={{
              fontSize: 17,
              color: "#64748B",
            }}
          />

          <Typography
            sx={{
              fontSize: 10.5,
              color: "#64748B",
            }}
          >
            Administrative functions are restricted according to
            user roles and permissions.
          </Typography>

        </Stack>
      </Box>

    </Box>
  );
}