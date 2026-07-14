import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Badge,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import logo from "../assets/logo/kgn-logo.png";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,.82)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(226,232,240,.9)",
        color: "#16355B",
        height: 82,
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 4,
        }}
      >
        {/* Left */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="KGN"
            sx={{
              width: 74,
              transition: ".35s",

              filter:
                "drop-shadow(0 8px 18px rgba(37,99,235,.25)) drop-shadow(0 3px 8px rgba(0,0,0,.18))",

              "&:hover": {
                transform: "scale(1.05)",
                filter:
                  "drop-shadow(0 12px 25px rgba(37,99,235,.45))",
              },
            }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 23,
                lineHeight: 1,
                color: "#16355B",
              }}
            >
              Kousha Gaman Namavar
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                mt: .6,
                fontSize: 13,
                letterSpacing: 1,
              }}
            >
              PROJECT CONTROL SYSTEM
            </Typography>
          </Box>
        </Box>

        {/* Center */}

        <TextField
          placeholder="Search anything..."
          size="small"
          sx={{
            width: 420,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#F8FAFC",
              borderRadius: 4,
              height: 48,

              "& fieldset": {
                borderColor: "#E2E8F0",
              },

              "&:hover fieldset": {
                borderColor: "#2563EB",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#2563EB",
              },
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

        {/* Right */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <IconButton
            sx={{
              bgcolor: "#F8FAFC",

              "&:hover": {
                bgcolor: "#EEF4FB",
              },
            }}
          >
            <Badge color="error" variant="dot">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>

          <IconButton
            sx={{
              bgcolor: "#F8FAFC",

              "&:hover": {
                bgcolor: "#EEF4FB",
              },
            }}
          >
            <Badge color="primary" variant="dot">
              <ChatRoundedIcon />
            </Badge>
          </IconButton>

          <IconButton
            sx={{
              bgcolor: "#F8FAFC",

              "&:hover": {
                bgcolor: "#EEF4FB",
              },
            }}
          >
            <SettingsRoundedIcon />
          </IconButton>

          <Box
            sx={{
              ml: 2,
              pl: 2,
              borderLeft: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#2563EB",
                width: 48,
                height: 48,
                boxShadow:
                  "0 10px 25px rgba(37,99,235,.35)",
              }}
            >
              R
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Ruhollah Hajipour
              </Typography>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: 12,
                }}
              >
                System Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}