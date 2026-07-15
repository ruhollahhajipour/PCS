import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

interface LoadingProps {
  message?: string;

  size?: number;
}

export default function Loading({
  message = "Loading...",
  size = 40,
}: LoadingProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      py={6}
      gap={2}
    >
      <CircularProgress size={size} />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {message}
      </Typography>
    </Box>
  );
}