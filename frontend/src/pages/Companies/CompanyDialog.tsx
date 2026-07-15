import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import CompanyForm from "./CompanyForm";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CompanyDialog({
  open,
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Company Information
      </DialogTitle>

      <DialogContent dividers>
        <CompanyForm />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}