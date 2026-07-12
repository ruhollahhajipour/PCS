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
    title: "Dashboard",
    path: "/dashboard",
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
        width: 280,
        height: "100vh",
        background:
          "linear-gradient(180deg,#0B1120 0%,#111827 55%,#1E1B4B 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        boxShadow: "8px 0 30px rgba(0,0,0,.35)",
      }}
    >
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          PCS
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#A5B4FC",
          }}
        >
          Enterprise Platform
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />

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

              "&.active": {
                background:
                  "linear-gradient(90deg,#4F46E5,#7C3AED)",
                boxShadow:
                  "0 10px 25px rgba(124,58,237,.45)",
              },

              "&:hover": {
                transform: "translateX(5px)",
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

      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#94A3B8",
            display: "block",
          }}
        >
          PCS Enterprise Platform
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#818CF8",
          }}
        >
          © Kousha Gaman Namavar
        </Typography>
      </Box>
    </Box>
  );
}