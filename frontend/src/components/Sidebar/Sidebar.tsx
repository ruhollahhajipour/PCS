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
<Box
    component="img"
    src="/kgn-logo.png"
    sx={{
        width:120
    }}
/>
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

import logo from "../../assets/logo/kgn-logo.png";
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
        width: 285,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",

        background:
          "linear-gradient(180deg,#081120 0%,#111827 45%,#1E1B4B 100%)",

        boxShadow: "8px 0 30px rgba(0,0,0,.35)",
      }}
    >
      {/* ========================= */}
      {/* Logo */}
      {/* ========================= */}

      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="KGN Logo"
          sx={{
            width: 120,
            mb: 2,

            filter: "drop-shadow(0 8px 20px rgba(0,0,0,.35))",

            transition: ".3s",

            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 18,
            color: "white",
          }}
        >
          Kousha Gaman Namavar
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: "#94A3B8",
            fontSize: 12,
            letterSpacing: 0.7,
          }}
        >
          Project Cost Control System
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />

      {/* ========================= */}
      {/* Menu */}
      {/* ========================= */}

      <List sx={{ mt: 2 }}>
        {menus.map((item) => (
          <ListItemButton
            key={item.title}
            component={NavLink}
            to={item.path}
            sx={{
              mx: 1.5,
              mb: 1,
              borderRadius: 3,

              color: "#E2E8F0",

              transition: ".25s",

              "&.active": {
                background:
                  "linear-gradient(90deg,#4F46E5,#7C3AED)",

                boxShadow:
                  "0 12px 25px rgba(124,58,237,.40)",
              },

              "&:hover": {
                transform: "translateX(6px)",

                background:
                  "linear-gradient(90deg,#4F46E5,#7C3AED)",
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

      <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />

      {/* ========================= */}
      {/* Footer */}
      {/* ========================= */}

      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "#E2E8F0",
          }}
        >
          PCS Enterprise
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#94A3B8",
            mt: 0.5,
          }}
        >
          Project Cost Control System
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#6366F1",
            mt: 1,
          }}
        >
          Powered by Kousha Gaman Namavar
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#64748B",
            mt: 1,
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
}