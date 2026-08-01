import { Box, Button } from "@mui/material";

type PCSFormActionsProps = {
  loading?: boolean;
  saveText?: string;
  cancelText?: string;
  onCancel: () => void;
};

export default function PCSFormActions({
  loading = false,
  saveText = "Save",
  cancelText = "Cancel",
  onCancel,
}: PCSFormActionsProps) {
  return (
    <Box
      sx={{
        mt: 4,
        pt: 3,
        borderTop: "1px solid #E5E7EB",
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      <Button
        variant="outlined"
        color="inherit"
        onClick={onCancel}
        sx={{
          minWidth: 120,
          borderRadius: 2,
        }}
      >
        {cancelText}
      </Button>

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          minWidth: 140,
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        {loading ? "Saving..." : saveText}
      </Button>
    </Box>
  );
}