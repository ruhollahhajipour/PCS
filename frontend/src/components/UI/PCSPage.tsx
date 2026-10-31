import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function PCSPage({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <Box p={4}>

      <Typography
        variant="h4"
        fontWeight={700}
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        {subtitle}
      </Typography>

      {children}

    </Box>
  );
}