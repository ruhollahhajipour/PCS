import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        height: 72,
        justifyContent: "center",
        borderBottom: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 24,
              color: "#16355B",
            }}
          >
            Good Evening, Ruhollah 👋
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: 14,
            }}
          >
            Welcome back to PCS Dashboard
          </Typography>
        </Box>

        {/* Right */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search..."
            sx={{
              width: 280,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#F8FAFC",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />

          <IconButton
            sx={{
              bgcolor: "#F8FAFC",
            }}
          >
            <NotificationsNoneRoundedIcon />
          </IconButton>

          <IconButton
            sx={{
              bgcolor: "#F8FAFC",
            }}
          >
            <SettingsRoundedIcon />
          </IconButton>

          <Avatar
            sx={{
              bgcolor: "#16355B",
              width: 42,
              height: 42,
              fontWeight: 700,
            }}
          >
            R
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}