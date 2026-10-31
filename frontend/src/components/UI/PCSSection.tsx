import { Box } from "@mui/material";

export default function PCSSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        mt: 3,
      }}
    >
      {children}
    </Box>
  );
}