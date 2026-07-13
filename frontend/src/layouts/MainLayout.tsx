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
          {children}
        </Box>
      </Box>
    </Box>
  );
}