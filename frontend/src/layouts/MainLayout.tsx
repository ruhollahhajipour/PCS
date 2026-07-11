import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F4F6F8" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Header />

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}