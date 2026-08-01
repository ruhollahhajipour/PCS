import type { ReactNode } from "react";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import InboxRoundedIcon from "@mui/icons-material/InboxRounded";

interface EmptyStateProps {
  title?: string;

  description?: string;

  actionLabel?: string;

  onAction?: () => void;

  icon?: ReactNode;
}

export default function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display.",
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      textAlign="center"
    >
      <Box
        sx={{
          color: "text.secondary",
          mb: 2,
        }}
      >
        {icon ?? (
          <InboxRoundedIcon
            sx={{
              fontSize: 72,
            }}
          />
        )}
      </Box>

      <Typography
        variant="h6"
        fontWeight={600}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1,
          maxWidth: 400,
        }}
      >
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}