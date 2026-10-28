import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "../components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#EEF3FB",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Header />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",

            px: {
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
            },

            py: {
              xs: 1,
              sm: 2,
              md: 3,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}