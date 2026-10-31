import { Stack, Typography } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
};

export default function CRUDHeader({
  title,
  subtitle,
}: Props) {
  return (
    <Stack spacing={0.5} mb={3}>
      <Typography
        variant="h4"
        fontWeight={700}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}