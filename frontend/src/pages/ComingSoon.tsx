import { Box, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ComingSoon() {
  const { pathname } = useLocation();
  const name = pathname.replace("/", "").replace("-", " ");
  return (
    <Box>
      <Typography
        sx={{ fontSize: 30, fontWeight: 700, color: "#16355B", mb: 2, textTransform: "capitalize" }}
      >
        {name}
      </Typography>
      <Paper elevation={0} sx={{ borderRadius: 4, p: 4 }}>
        <Typography color="text.secondary">This module is under development.</Typography>
      </Paper>
    </Box>
  );
}
