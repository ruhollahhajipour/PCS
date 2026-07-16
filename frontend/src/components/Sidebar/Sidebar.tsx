import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  Dashboard,
  Business,
  Apartment,
  Folder,
  AccountBalanceWallet,
  Warehouse,
  ShoppingCart,
  Description,
  BarChart,
  Settings,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

const menu = [
  {
    text: "Workspace",
    icon: <Dashboard />,
    path: "/",
  },
  {
    text: "Companies",
    icon: <Business />,
    path: "/companies",
  },
  {
    text: "Plants",
    icon: <Apartment />,
    path: "/plants",
  },
  {
    text: "Projects",
    icon: <Folder />,
    path: "/projects",
  },
  {
    text: "Cost Control",
    icon: <AccountBalanceWallet />,
    path: "/cost-control",
  },
  {
    text: "Warehouse",
    icon: <Warehouse />,
    path: "/warehouse",
  },
  {
    text: "Procurement",
    icon: <ShoppingCart />,
    path: "/procurement",
  },
  {
    text: "Documents",
    icon: <Description />,
    path: "/documents",
  },
  {
    text: "Reports",
    icon: <BarChart />,
    path: "/reports",
  },
  {
    text: "Administration",
    icon: <Settings />,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 270,
        height: "100vh",
        display: "flex",
        flexDirection: "column",

        background:
          "linear-gradient(180deg,#32455A 0%,#2A3B4F 100%)",

        color: "#fff",

        borderRight: "1px solid rgba(255,255,255,.08)",
      }}
    >
      {/* ================= LOGO ================= */}

      <Box
        sx={{
          pt: 4,
          pb: 3,
          px: 2,
          textAlign: "center",
        }}
      >
        {/* لوگوی برنامه */}
        <Box
          component="img"
          src="/pcs-logo.png"
          alt="PCS"
          sx={{
            width: 74,
            mb: 1.2,
          }}
        />

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 22,
            lineHeight: 1.2,
          }}
        >
          Project Control System
        </Typography>

        <Typography
          sx={{
            mt: 0.3,
            fontSize: 12,
            color: "#AFC5D9",
          }}
        >
          Enterprise Project Management Platform
        </Typography>

        {/* لوگوی شرکت */}
        <Box
          component="img"
          src="/logo.png"
          alt="KNG"
          sx={{
            width: 95,
            mt: 3,
            mb: 1,
            opacity: 0.95,
          }}
        />

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          KNG
        </Typography>

        <Typography
          sx={{
            fontSize: 11,
            color: "#C9D4DE",
          }}
        >
          Multi Purpose Engineering Company
        </Typography>

        <Typography
          sx={{
            mt: 0.8,
            fontSize: 10,
            letterSpacing: 2,
            color: "#79B8FF",
          }}
        >
          Version 1.0
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
        }}
      />

      {/* ================= MENU ================= */}

      <List
        sx={{
          mt: 2,
          px: 1.5,
        }}
      >
        {menu.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            end={item.path === "/"}
            sx={{
              borderRadius: 3,
              mb: 0.8,
              py: 1.2,

              color: "#E8EEF7",

              "& .MuiListItemIcon-root": {
                color: "#E8EEF7",
                minWidth: 40,
              },

              "&.active": {
                background:
                  "linear-gradient(90deg,#4A8BFF,#5B63FF)",

                color: "#fff",

                boxShadow:
                  "0 8px 22px rgba(70,110,255,.35)",

                "& .MuiListItemIcon-root": {
                  color: "#fff",
                },
              },

              "&:hover": {
                background:
                  "rgba(255,255,255,.08)",
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: 15,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}