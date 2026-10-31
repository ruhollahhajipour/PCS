import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";

import {
  NotificationsRounded,
  SettingsRounded,
  PersonRounded,
  LockRounded,
  LogoutRounded,
  PaletteRounded,
  LanguageRounded,
  DateRangeRounded,
  AccessTimeRounded,
  AdminPanelSettingsRounded,
  PeopleRounded,
  SecurityRounded,
  TuneRounded,
  HistoryRounded,
  StorageRounded,
  InfoRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import WorkspaceSelector from "./WorkspaceSelector";
import { useAuth } from "../../context/useAuth";

export default function Header() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [profileAnchor, setProfileAnchor] =
    useState<null | HTMLElement>(null);

  const [settingsAnchor, setSettingsAnchor] =
    useState<null | HTMLElement>(null);

  const [adminAnchor, setAdminAnchor] =
    useState<null | HTMLElement>(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const now = new Date();
  const hour = now.getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  const profileOpen = Boolean(profileAnchor);
  const settingsOpen = Boolean(settingsAnchor);
  const adminOpen = Boolean(adminAnchor);

  const handleProfileOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (loggingOut) return;

    setProfileAnchor(event.currentTarget);
  };

  const handleSettingsOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (loggingOut) return;

    setSettingsAnchor(event.currentTarget);
  };

  const handleAdminOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (loggingOut) return;

    setAdminAnchor(event.currentTarget);
  };

  const closeMenus = () => {
    setProfileAnchor(null);
    setSettingsAnchor(null);
    setAdminAnchor(null);
  };

  const navigateAndClose = (path: string) => {
    closeMenus();
    navigate(path);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      closeMenus();

      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("LOGOUT ERROR", error);

      navigate("/", {
        replace: true,
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const controlButtonSx = {
    width: 38,
    height: 38,
    color: "#64748B",
    borderRadius: 2,
    border: "1px solid transparent",
    transition: "all .18s ease",

    "&:hover": {
      bgcolor: "#F8FAFC",
      color: "#2563EB",
      borderColor: "#E2E8F0",
    },
  };

  const menuPaperSx = {
    mt: 1,
    borderRadius: 2.25,
    border: "1px solid #E2E8F0",
    boxShadow:
      "0 14px 38px rgba(15,23,42,.12)",
    overflow: "hidden",
  };

  const menuItemSx = {
    minHeight: 54,
    px: 1.5,

    "& .MuiListItemIcon-root": {
      minWidth: 36,
      color: "#64748B",
    },

    "&:hover": {
      bgcolor: "#F8FAFC",
    },
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,.96)",
        backdropFilter: "blur(16px)",
        color: "#172033",
        borderBottom:
          "1px solid rgba(226,232,240,.92)",
        boxShadow:
          "0 1px 3px rgba(15,23,42,.025)",
        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 68,
            md: 76,
          },

          px: {
            xs: 2,
            sm: 2.5,
            md: 3,
            lg: 3.5,
            xl: 4,
          },

          display: "flex",
          alignItems: "center",

          gap: {
            xs: 1,
            md: 1.5,
          },
        }}
      >
        {/* =====================================================
            LEFT — GREETING
        ===================================================== */}

        <Box
          sx={{
            width: {
              md: 175,
              lg: 195,
              xl: 205,
            },

            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 13.5,
                md: 14.5,
                lg: 15,
              },

              lineHeight: 1.25,
              fontWeight: 700,
              letterSpacing: "-0.015em",
              color: "#1E293B",
              whiteSpace: "nowrap",
            }}
          >
            {greeting}, Ruhollah
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              color: "#94A3B8",
              fontSize: 10,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            Project workspace
          </Typography>
        </Box>

        {/* =====================================================
            CENTER — WORKSPACE
        ===================================================== */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,

            display: {
              xs: "none",
              md: "flex",
            },

            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          <WorkspaceSelector />
        </Box>

        {/* =====================================================
            RIGHT — SYSTEM CONTROLS
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            flexShrink: 0,
          }}
        >
          {/* DATE / TIME */}

          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },

              textAlign: "right",
              mr: 1,
              minWidth: 88,
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#475569",
                whiteSpace: "nowrap",
              }}
            >
              {now.toLocaleDateString()}
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                fontSize: 9.5,
                mt: 0.15,
                whiteSpace: "nowrap",
              }}
            >
              {now.toLocaleTimeString()}
            </Typography>
          </Box>

          {/* NOTIFICATIONS */}

          <Tooltip title="Notifications">
            <IconButton
              size="small"
              disabled={loggingOut}
              sx={controlButtonSx}
            >
              <Badge
                badgeContent={5}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 8,
                    minWidth: 15,
                    height: 15,
                    fontWeight: 700,
                  },
                }}
              >
                <NotificationsRounded fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* SETTINGS */}

          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={handleSettingsOpen}
              disabled={loggingOut}
              sx={{
                ...controlButtonSx,

                color: settingsOpen
                  ? "#2563EB"
                  : "#64748B",

                bgcolor: settingsOpen
                  ? "#EFF6FF"
                  : "transparent",

                borderColor: settingsOpen
                  ? "#DBEAFE"
                  : "transparent",
              }}
            >
              <SettingsRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* ADMINISTRATION */}

          <Tooltip title="Administration">
            <IconButton
              size="small"
              onClick={handleAdminOpen}
              disabled={loggingOut}
              sx={{
                ...controlButtonSx,

                color: adminOpen
                  ? "#2563EB"
                  : "#64748B",

                bgcolor: adminOpen
                  ? "#EFF6FF"
                  : "transparent",

                borderColor: adminOpen
                  ? "#DBEAFE"
                  : "transparent",
              }}
            >
              <AdminPanelSettingsRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* PROFILE */}

          <Box
            onClick={handleProfileOpen}
            sx={{
              ml: 0.5,
              pl: 0.7,
              pr: 0.55,
              py: 0.4,

              display: "flex",
              alignItems: "center",
              gap: 0.8,

              borderRadius: 2.25,

              cursor: loggingOut
                ? "default"
                : "pointer",

              transition: "all .18s ease",

              bgcolor: profileOpen
                ? "#EFF6FF"
                : "transparent",

              opacity: loggingOut ? 0.7 : 1,

              "&:hover": loggingOut
                ? {}
                : {
                    bgcolor: "#F8FAFC",
                  },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#2563EB",
                fontSize: 12,
                fontWeight: 800,
                boxShadow:
                  "0 4px 12px rgba(37,99,235,.18)",
              }}
            >
              RH
            </Avatar>

            <Box
              sx={{
                display: {
                  xs: "none",
                  lg: "block",
                },

                minWidth: 98,
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#1E293B",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                Ruhollah Hajipour
              </Typography>

              <Typography
                sx={{
                  color: "#94A3B8",
                  fontSize: 9.5,
                  mt: 0.25,
                  whiteSpace: "nowrap",
                }}
              >
                Project Manager
              </Typography>
            </Box>

            <KeyboardArrowDownRounded
              sx={{
                fontSize: 17,
                color: "#94A3B8",

                transform: profileOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",

                transition:
                  "transform .18s ease",
              }}
            />
          </Box>
        </Box>
      </Toolbar>

      {/* =======================================================
          PROFILE MENU
      ======================================================= */}

      <Menu
        anchorEl={profileAnchor}
        open={profileOpen}
        onClose={() =>
          setProfileAnchor(null)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            ...menuPaperSx,
            minWidth: 245,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.6,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 750,
              color: "#1E293B",
            }}
          >
            Ruhollah Hajipour
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: 10.5,
              color: "#94A3B8",
            }}
          >
            Project Manager
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() =>
            navigateAndClose("/settings")
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <PersonRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="My Profile"
            secondary="Personal information"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose("/settings")
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <LockRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Security"
            secondary="Username & password"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          disabled={loggingOut}
          sx={{
            ...menuItemSx,
            color: "#DC2626",

            "& .MuiListItemIcon-root": {
              minWidth: 36,
              color: "#DC2626",
            },
          }}
        >
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary={
              loggingOut
                ? "Signing out..."
                : "Sign out"
            }
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
          />
        </MenuItem>
      </Menu>

      {/* =======================================================
          SETTINGS MENU
      ======================================================= */}

      <Menu
        anchorEl={settingsAnchor}
        open={settingsOpen}
        onClose={() =>
          setSettingsAnchor(null)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            ...menuPaperSx,
            minWidth: 255,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 750,
              color: "#1E293B",
            }}
          >
            Settings
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: 10,
              color: "#94A3B8",
            }}
          >
            Personal application preferences
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() =>
            navigateAndClose("/settings")
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <PaletteRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Appearance"
            secondary="Theme & accent color"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose("/settings")
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <LanguageRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Language"
            secondary="Interface language"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose("/settings")
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <DateRangeRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Date Format"
            secondary="Regional date settings"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose("/settings")
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <AccessTimeRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Time Format"
            secondary="12 / 24 hour format"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose("/settings")
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <TuneRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Preferences"
            secondary="Application preferences"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>
      </Menu>

      {/* =======================================================
          ADMINISTRATION MENU
      ======================================================= */}

      <Menu
        anchorEl={adminAnchor}
        open={adminOpen}
        onClose={() =>
          setAdminAnchor(null)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            ...menuPaperSx,
            minWidth: 270,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 750,
              color: "#1E293B",
            }}
          >
            Administration
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: 10,
              color: "#94A3B8",
            }}
          >
            System and organizational management
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() =>
            navigateAndClose(
              "/administration/users"
            )
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <PeopleRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Users"
            secondary="User accounts & access"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose(
              "/administration/roles"
            )
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <SecurityRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Roles & Permissions"
            secondary="Access control"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose(
              "/administration"
            )
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <TuneRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="System Configuration"
            secondary="Global system settings"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose(
              "/administration"
            )
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <HistoryRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Audit Log"
            secondary="System activity history"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={() =>
            navigateAndClose(
              "/administration"
            )
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <StorageRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Database & Backup"
            secondary="Data management"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() =>
            navigateAndClose(
              "/administration"
            )
          }
          sx={menuItemSx}
        >
          <ListItemIcon>
            <InfoRounded fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="About PCS"
            secondary="Version & product information"
            primaryTypographyProps={{
              fontSize: 12,
              fontWeight: 650,
            }}
            secondaryTypographyProps={{
              fontSize: 10,
            }}
          />
        </MenuItem>
      </Menu>
    </AppBar>
  );
}