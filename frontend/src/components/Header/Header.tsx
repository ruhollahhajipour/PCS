import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #ECEFF3",
      }}
    >
      <Toolbar sx={{ height: 72 }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#16355B",
            }}
          >
            PCS
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Project Control System
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton>
          <NotificationsNoneRoundedIcon />
        </IconButton>

        <IconButton sx={{ mx: 1 }}>
          <SettingsRoundedIcon />
        </IconButton>

        <Avatar
          sx={{
            bgcolor: "#16355B",
            width: 40,
            height: 40,
            fontWeight: 700,
          }}
        >
          R
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}