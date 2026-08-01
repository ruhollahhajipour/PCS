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

  /**
   * برای سازگاری با کل پروژه
   */
  width?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl";

  /**
   * اگر جایی هنوز از maxWidth استفاده شده
   */
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

  width,
  maxWidth,
}: PCSDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={width ?? maxWidth ?? "md"}
    >
      <DialogTitle>{title}</DialogTitle>

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