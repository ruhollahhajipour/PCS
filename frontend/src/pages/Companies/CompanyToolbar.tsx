import { Box, Button, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface CompanyToolbarProps {
  onCreate: () => void;
}

export default function CompanyToolbar({
  onCreate,
}: CompanyToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Companies
        </Typography>

        <Typography color="text.secondary">
          Enterprise Company Management
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={onCreate}
      >
        New Company
      </Button>
    </Box>
  );
}