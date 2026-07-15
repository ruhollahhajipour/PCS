import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "../components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#EEF4FB",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 290,
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </Box>

      {/* Main */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Header />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: 4,
            py: 4,
            background: `
              radial-gradient(circle at top left,#DBEAFE 0%,transparent 35%),
              radial-gradient(circle at bottom right,#E0E7FF 0%,transparent 25%),
              linear-gradient(180deg,#F8FBFF 0%,#EEF4FB 100%)
            `,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}