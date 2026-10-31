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

import logo from "../assets/brand/logo.png";

import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

export default function Header() {

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
          minHeight: 86,
          display: "flex",
          justifyContent: "space-between",
        }}
      >

        {/* Left Side */}
        <Box>

          <Chip
            size="small"
            label="KNG Engineering"
            color="primary"
            sx={{ mb: 1 }}
          />

          <Typography
            fontSize={34}
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

        {/* Right Side */}

        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >

          {/* Logo */}

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mr={2}
          >

            <img
              src={logo}
              alt="PCS"
              style={{
                height: 46,
                width: "auto",
              }}
            />

            <Box>

              <Typography
                variant="h6"
                fontWeight={800}
                lineHeight={1}
              >
                PCS
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Integrated Project Control Platform
              </Typography>

            </Box>

          </Box>

          {/* Date */}

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
            <CalendarMonthRoundedIcon />
          </IconButton>

          <IconButton>
            <LightModeRoundedIcon />
          </IconButton>

          <IconButton>

            <Badge
              badgeContent={5}
              color="primary"
            >
              <NotificationsRoundedIcon />
            </Badge>

          </IconButton>

          <IconButton>
            <SettingsRoundedIcon />
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