import Button from "@mui/material/Button";

import type { ButtonProps } from "@mui/material/Button";

export default function PCSButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      disableElevation
      sx={{
        borderRadius: 3,
        px: 3,
        py: 1.2,
        fontWeight: 600,
        textTransform: "none",
        background:
          "linear-gradient(90deg,#2563EB,#6D28D9)",

        "&:hover": {
          background:
            "linear-gradient(90deg,#1D4ED8,#5B21B6)",
        },

        ...props.sx,
      }}
      {...props}
    />
  );
}