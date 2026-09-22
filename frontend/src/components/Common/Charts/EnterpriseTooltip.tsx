import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

type TooltipPayloadItem = {
  payload?: Record<string, unknown>;
};

type NumericEntry = [string, number];

type Props = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

export default function EnterpriseTooltip({
  active,
  payload,
  label,
}: Props) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  const entries: NumericEntry[] = Object.entries(item)
    .filter((entry) => typeof entry[1] === "number")
    .map(([key, value]) => [
      key,
      value as number,
    ]);

  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        minWidth: 220,
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        background: "#FFFFFF",
      }}
    >
      <Typography fontWeight={700} mb={2}>
        {label}
      </Typography>

      <Stack spacing={1.2}>
        {entries.map(([key, value]) => (
          <Box
            key={key}
            display="flex"
            justifyContent="space-between"
            gap={3}
          >
            <Typography
              color="text.secondary"
              textTransform="capitalize"
            >
              {key}
            </Typography>

            <Typography fontWeight={700}>
              {value.toLocaleString("en-US")}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}