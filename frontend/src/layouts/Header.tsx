import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge,
} from "@mui/material";

import {
  NotificationsNone,
  Settings,
} from "@mui/icons-material";

import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Workspace",
  "/companies": "Companies",
  "/plants": "Plants",
  "/projects": "Projects",
  "/cost-control": "Cost Control",
  "/warehouse": "Warehouse",
  "/procurement": "Procurement",
  "/documents": "Documents",
  "/reports": "Reports",
  "/settings": "Administration",
};

export default function Header() {
  const location = useLocation();

  const title =
    pageTitles[location.pathname] ??
    "Project Control System";

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#1F2937",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 72,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {greeting},
            Welcome to PCS
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >
          <IconButton>
            <Badge
              badgeContent={4}
              color="primary"
            >
              <NotificationsNone />
            </Badge>
          </IconButton>

          <IconButton>
            <Settings />
          </IconButton>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <Avatar
              sx={{
                bgcolor: "#3A7BFF",
                width: 42,
                height: 42,
              }}
            >
              R
            </Avatar>

            <Box>
              <Typography
                fontWeight={700}
                fontSize={14}
              >
                Ruhollah Hajipour
              </Typography>

              <Typography
                fontSize={12}
                color="text.secondary"
              >
                Project Manager
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}