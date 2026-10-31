import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

type PCSDialogProps = {
  open: boolean;
  title: string;
  width?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  onClose: () => void;
};

export default function PCSDialog({
  open,
  title,
  width = "md",
  children,
  onClose,
}: PCSDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={width}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(15,23,42,.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 3,
          borderBottom: "1px solid #E5E7EB",
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        {title}

        <IconButton
          size="small"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          bgcolor: "#F8FAFC",
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}