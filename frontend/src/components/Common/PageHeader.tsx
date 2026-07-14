import { Box, Typography, Breadcrumbs } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

type Props = {
  title: string;
  subtitle: string;
};

export default function PageHeader({
  title,
  subtitle,
}: Props) {
  return (
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs sx={{ mb: 1 }}>
        <HomeRoundedIcon
          sx={{
            fontSize: 18,
          }}
        />

        <Typography color="#2563EB">
          {title}
        </Typography>
      </Breadcrumbs>

      <Typography
        sx={{
          fontSize: 40,
          fontWeight: 800,
          color: "#16355B",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 1,
          color: "#64748B",
          fontSize: 17,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}