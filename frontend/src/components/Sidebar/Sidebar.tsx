import logo from "../../assets/logo/kgn-logo.png";

import {
  DashboardRounded,
  BusinessRounded,
  ApartmentRounded,
  FolderRounded,
  AccountBalanceWalletRounded,
  Inventory2Rounded,
  ShoppingCartRounded,
  DescriptionRounded,
  AssessmentRounded,
  SettingsRounded,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Workspace",
    path: "/workspace",
    icon: <DashboardRounded />,
  },
  {
    title: "Companies",
    path: "/companies",
    icon: <BusinessRounded />,
  },
  {
    title: "Plants",
    path: "/plants",
    icon: <ApartmentRounded />,
  },
  {
    title: "Projects",
    path: "/projects",
    icon: <FolderRounded />,
  },
  {
    title: "Cost Control",
    path: "/cost-control",
    icon: <AccountBalanceWalletRounded />,
  },
  {
    title: "Warehouse",
    path: "/warehouse",
    icon: <Inventory2Rounded />,
  },
  {
    title: "Procurement",
    path: "/procurement",
    icon: <ShoppingCartRounded />,
  },
  {
    title: "Documents",
    path: "/documents",
    icon: <DescriptionRounded />,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <AssessmentRounded />,
  },
  {
    title: "Administration",
    path: "/administration",
    icon: <SettingsRounded />,
  },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 290,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg,#07111F 0%,#0F172A 55%,#1E1B4B 100%)",
        color: "#fff",
        boxShadow: "10px 0 35px rgba(0,0,0,.35)",
      }}
    >
      {/* Logo */}

      <Box
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="KGN"
          sx={{
            width: 185,

            filter:
              "drop-shadow(0 8px 15px rgba(0,0,0,.25)) drop-shadow(0 0 18px rgba(37,99,235,.25))",

            transition: ".35s",

            "&:hover": {
              transform: "scale(1.04)",
              filter:
                "drop-shadow(0 10px 20px rgba(0,0,0,.35)) drop-shadow(0 0 30px rgba(37,99,235,.45))",
            },
          }}
        />

        <Typography
          sx={{
            mt: 2,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 0.5,
            color: "#F8FAFC",
            textShadow:
              "0 2px 10px rgba(0,0,0,.45)",
          }}
        >
          Project Control System
        </Typography>

        <Typography
          sx={{
            color: "#60A5FA",
            fontSize: 13,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          Enterprise Platform
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
        }}
      />

      {/* Menu */}

      <List sx={{ mt: 2 }}>
        {menus.map((item) => (
          <ListItemButton
            key={item.title}
            component={NavLink}
            to={item.path}
            sx={{
              mx: 1.5,
              mb: 1,
              py: 1.2,
              borderRadius: 3,
              color: "#E2E8F0",
              transition: ".25s",

              "&.active": {
                background:
                  "linear-gradient(90deg,#2563EB,#4F46E5)",

                boxShadow:
                  "0 10px 30px rgba(37,99,235,.35)",
              },

              "&:hover": {
                transform: "translateX(6px)",
                background:
                  "linear-gradient(90deg,#2563EB,#4F46E5)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: 42,
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
        }}
      />

      {/* Footer */}

      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#94A3B8",
          }}
        >
          PCS Enterprise Platform
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#60A5FA",
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
}