import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Chip,
} from "@mui/material";

import {
  NotificationsRounded,
  SettingsRounded,
  LightModeRounded,
  CalendarMonthRounded,
} from "@mui/icons-material";

import WorkspaceSelector from "./WorkspaceSelector";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function Header() {
  const { workspace } = useWorkspace();

  const now = new Date();

  const hour = now.getHours();

  let greeting = "Good Evening";

  if (hour < 12)
    greeting = "Good Morning";
  else if (hour < 18)
    greeting = "Good Afternoon";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,.82)",
        backdropFilter: "blur(18px)",
        color: "#0F172A",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 92,
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Left */}

        <Box sx={{ minWidth: 280 }}>
          <Chip
            size="small"
            color="primary"
            label={workspace.company.code}
            sx={{ mb: 1 }}
          />

          <Typography
            fontSize={30}
            fontWeight={800}
          >
            Project Control Suite
          </Typography>

          <Typography
            color="text.secondary"
            mt={0.5}
          >
            {greeting}, Ruhollah 👋
          </Typography>
        </Box>

        {/* Center */}

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WorkspaceSelector />
        </Box>

        {/* Right */}

        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
        >
          <Box textAlign="right">
            <Typography fontWeight={700}>
              {now.toLocaleDateString()}
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={13}
            >
              {now.toLocaleTimeString()}
            </Typography>
          </Box>

          <IconButton>
            <CalendarMonthRounded />
          </IconButton>

          <IconButton>
            <LightModeRounded />
          </IconButton>

          <IconButton>
            <Badge
              badgeContent={5}
              color="primary"
            >
              <NotificationsRounded />
            </Badge>
          </IconButton>

          <IconButton>
            <SettingsRounded />
          </IconButton>

          <Avatar
            sx={{
              bgcolor: "#2563EB",
              width: 46,
              height: 46,
              fontWeight: 800,
            }}
          >
            RH
          </Avatar>

          <Box>
            <Typography fontWeight={700}>
              Ruhollah Hajipour
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={13}
            >
              Project Manager
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}