import {
  Dashboard,
  Folder,
  AttachMoney,
  Inventory2,
  ShoppingCart,
  AccountBalance,
  Description,
} from "@mui/icons-material";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

const menus = [
  { title: "Dashboard", icon: <Dashboard /> },
  { title: "Projects", icon: <Folder /> },
  { title: "Cost Control", icon: <AttachMoney /> },
  { title: "Warehouse", icon: <Inventory2 /> },
  { title: "Procurement", icon: <ShoppingCart /> },
  { title: "Finance", icon: <AccountBalance /> },
  { title: "Documents", icon: <Description /> },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "#0F172A",
        color: "white",
        height: "100vh",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          py: 3,
          fontWeight: "bold",
        }}
      >
        PCS
      </Typography>

      <Divider sx={{ bgcolor: "#334155" }} />

      <List>
        {menus.map((item) => (
          <ListItemButton
            key={item.title}
            sx={{
              py: 1.5,
              "&:hover": {
                bgcolor: "#1E293B",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}