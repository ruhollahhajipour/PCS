import { Box, Typography } from "@mui/material";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#16355B",
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}