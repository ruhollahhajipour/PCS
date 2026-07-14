import { Box, Paper, Typography } from "@mui/material";

export default function Workspace() {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 30,
          fontWeight: 700,
          color: "#16355B",
          mb: 1,
        }}
      >
        Welcome Ruhollah 👋
      </Typography>

      <Typography
        sx={{
          color: "#64748B",
          mb: 4,
        }}
      >
        Project Cost Control System
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: 4,
          boxShadow: "0 12px 30px rgba(15,23,42,.08)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 24,
            mb: 2,
          }}
        >
          Workspace
        </Typography>

        <Typography color="text.secondary">
          From here users will select their Company and Project before entering
          different modules.
        </Typography>
      </Paper>
    </Box>
  );
}