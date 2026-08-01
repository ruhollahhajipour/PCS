import { Box, Typography } from "@mui/material";

interface StatItemProps {
  label: string;
  value: string | number;
}

export default function StatItem({
  label,
  value,
}: StatItemProps) {
  return (
    <Box sx={{ textAlign: "center", flex: 1 }}>
      <Typography
        variant="h6"
        fontWeight={700}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>
    </Box>
  );
}