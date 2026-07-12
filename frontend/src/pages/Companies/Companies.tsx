import { Box, Button, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function Companies() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Companies
          </Typography>

          <Typography color="text.secondary">
            Enterprise Company Management
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.2,
            background:
              "linear-gradient(90deg,#4F46E5,#7C3AED)",
          }}
        >
          New Company
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          height: 500,
          boxShadow: "0 12px 35px rgba(0,0,0,.08)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="text.secondary">
          Company List (Coming Soon...)
        </Typography>
      </Box>
    </Box>
  );
}