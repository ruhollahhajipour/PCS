import type { ReactNode } from "react";

import {
  Paper,
  Stack,
  Divider,
  Typography,
  Button,
} from "@mui/material";

interface PCSFormProps {
  title?: string;

  children: ReactNode;

  onSubmit?: () => void;

  onCancel?: () => void;

  submitText?: string;

  cancelText?: string;

  loading?: boolean;
}

export default function PCSForm({
  title,
  children,
  onSubmit,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
}: PCSFormProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        p: 3,
      }}
    >
      {title && (
        <>
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
          >
            {title}
          </Typography>

          <Divider sx={{ mb: 3 }} />
        </>
      )}

      <Stack spacing={2}>
        {children}
      </Stack>

      {(onSubmit || onCancel) && (
        <>
          <Divider sx={{ my: 3 }} />

          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
          >
            {onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
              >
                {cancelText}
              </Button>
            )}

            {onSubmit && (
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={loading}
              >
                {submitText}
              </Button>
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
}