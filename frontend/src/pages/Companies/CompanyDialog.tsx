import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import CompanyForm from "./CompanyForm";

interface CompanyDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CompanyDialog({
  open,
  onClose,
}: CompanyDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        New Company
      </DialogTitle>

      <DialogContent dividers>
        <CompanyForm />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}