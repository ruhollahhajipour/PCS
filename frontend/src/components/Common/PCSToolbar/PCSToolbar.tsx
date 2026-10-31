import type { ReactNode } from "react";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface PCSToolbarProps {
  title: string;

  subtitle?: string;

  actionLabel?: string;

  onAction?: () => void;

  actions?: ReactNode;
}

export default function PCSToolbar({
  title,
  subtitle,
  actionLabel,
  onAction,
  actions,
}: PCSToolbarProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{
        mb: 2,
      }}
    >
      <Box>
        <Typography
          variant="h5"
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
      </Box>

      <Stack
        direction="row"
        spacing={1}
      >
        {actions}

        {actionLabel && (
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}