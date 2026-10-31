import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

interface DeleteDialogProps {
  open: boolean;

  itemName?: string;

  onDelete: () => void;

  onCancel: () => void;
}

export default function DeleteDialog({
  open,
  itemName,
  onDelete,
  onCancel,
}: DeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete Confirmation
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          py={2}
        >
          <WarningAmberRoundedIcon
            color="warning"
            sx={{
              fontSize: 64,
              mb: 2,
            }}
          />

          <Typography
            align="center"
          >
            Are you sure you want to delete
          </Typography>

          {itemName && (
            <Typography
              mt={1}
              fontWeight={700}
              align="center"
            >
              {itemName}
            </Typography>
          )}

          <Typography
            mt={2}
            variant="body2"
            color="text.secondary"
            align="center"
          >
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}