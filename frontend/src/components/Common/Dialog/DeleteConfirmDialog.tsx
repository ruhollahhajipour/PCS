import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

type DeleteConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmDialog({
  open,
  title = "Delete",
  message = "Are you sure you want to delete this item?",
  itemName,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "error.main",
          fontWeight: 700,
        }}
      >
        <DeleteForeverRoundedIcon />

        {title}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            {message}
          </Typography>

          {itemName && (
            <Typography
              fontWeight={700}
              color="primary"
            >
              {itemName}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
          >
            This operation cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}