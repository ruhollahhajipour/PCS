import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#F6F8FB",
      }}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Box
        sx={{
          width: {
            xs: 0,
            md: 285,
          },
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <Sidebar />
      </Box>

      {/* =====================================================
          MAIN APPLICATION
      ===================================================== */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <Header />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: "auto",

            px: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 3.5,
              xl: 4,
            },

            py: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 3.5,
              xl: 4,
            },

            background: `
              radial-gradient(
                circle at 0% 0%,
                rgba(219,234,254,.42) 0%,
                transparent 32%
              ),
              radial-gradient(
                circle at 100% 100%,
                rgba(224,231,255,.34) 0%,
                transparent 28%
              ),
              linear-gradient(
                180deg,
                #F9FBFD 0%,
                #F6F8FB 100%
              )
            `,

            scrollbarWidth: "thin",

            "&::-webkit-scrollbar": {
              width: 7,
              height: 7,
            },

            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#CBD5E1",
              borderRadius: 20,
            },

            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#94A3B8",
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}