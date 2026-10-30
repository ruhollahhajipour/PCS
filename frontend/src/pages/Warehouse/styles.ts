import type { SxProps, Theme } from "@mui/material";

export const paperSx: SxProps<Theme> = {
  borderRadius: "16px",
  boxShadow: "0 12px 35px rgba(15,23,42,.08)",
  overflow: "hidden",
};

export const primaryBtnSx: SxProps<Theme> = {
  borderRadius: "12px",
  px: 3,
  py: 1.1,
  fontWeight: 600,
  textTransform: "none",
  background: "linear-gradient(90deg,#4F46E5,#7C3AED)",
  boxShadow: "none",
  "&:hover": {
    background: "linear-gradient(90deg,#4338CA,#6D28D9)",
    boxShadow: "none",
  },
};

export const headCellSx: SxProps<Theme> = {
  fontWeight: 700,
  color: "#334155",
  bgcolor: "#F1F5F9",
  whiteSpace: "nowrap",
};

export const POPUP_CLASS = "pcs-rtl";
