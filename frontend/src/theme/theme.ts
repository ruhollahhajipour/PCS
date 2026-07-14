import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
    },

    secondary: {
      main: "#4F46E5",
    },

    background: {
      default: "#EEF4FB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#16355B",
      secondary: "#64748B",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: [
      "Inter",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),

    h4: {
      fontWeight: 800,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow:
            "0 12px 35px rgba(15,23,42,.08)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow:
            "0 12px 35px rgba(15,23,42,.08)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          height: 46,
          borderRadius: 12,
          fontWeight: 700,
        },

        contained: {
          boxShadow:
            "0 10px 25px rgba(37,99,235,.25)",

          "&:hover": {
            boxShadow:
              "0 16px 35px rgba(37,99,235,.35)",
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: "#F8FAFC",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;