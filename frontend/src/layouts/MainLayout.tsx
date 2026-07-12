import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "../components/Sidebar/Sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#EEF3FB",
      }}
    >
      <Sidebar />

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
            py: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}