import {
  DashboardRounded,
  ApartmentRounded,
  FactoryRounded,
  FolderRounded,
  WarehouseRounded,
  ShoppingCartRounded,
  DescriptionRounded,
  AssessmentRounded,
} from "@mui/icons-material";

import {
  Box,
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
    icon: <DashboardRounded />,
    path: "/",
  },
  {
    title: "Companies",
    icon: <ApartmentRounded />,
    path: "/companies",
  },
  {
    title: "Plants",
    icon: <FactoryRounded />,
    path: "/plants",
  },
  {
    title: "Projects",
    icon: <FolderRounded />,
    path: "/projects",
  },
  {
    title: "Warehouse",
    icon: <WarehouseRounded />,
    path: "/warehouse",
  },
  {
    title: "Procurement",
    icon: <ShoppingCartRounded />,
    path: "/procurement",
  },
  {
    title: "Documents",
    icon: <DescriptionRounded />,
    path: "/documents",
  },
  {
    title: "Reports",
    icon: <AssessmentRounded />,
    path: "/reports",
  },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 290,
        height: "100vh",
        bgcolor: "#0F172A",
        color: "#fff",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          py: 3,
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        PCS
      </Typography>

      <List>
        {menus.map((item) => (
          <ListItemButton
            key={item.title}
            component={NavLink}
            to={item.path}
            sx={{
              color: "#CBD5E1",
              "&.active": {
                bgcolor: "#1E293B",
                color: "#fff",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}