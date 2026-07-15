import type { ReactNode } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface PCSDialogProps {
  open: boolean;

  title: string;

  children: ReactNode;

  onClose: () => void;

  onSave?: () => void;

  saveText?: string;

  cancelText?: string;

  maxWidth?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl";
}

export default function PCSDialog({
  open,
  title,
  children,
  onClose,
  onSave,
  saveText = "Save",
  cancelText = "Cancel",
  maxWidth = "md",
}: PCSDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent dividers>
        {children}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {cancelText}
        </Button>

        {onSave && (
          <Button
            variant="contained"
            onClick={onSave}
          >
            {saveText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}