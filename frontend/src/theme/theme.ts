import { createTheme } from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

export function createAppTheme(
  mode: ThemeMode = "light",
) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: "#2563EB",
        dark: "#1D4ED8",
        light: "#60A5FA",
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: "#4F46E5",
        dark: "#4338CA",
        light: "#818CF8",
        contrastText: "#FFFFFF",
      },

      background: isDark
        ? {
            default: "#0F172A",
            paper: "#172033",
          }
        : {
            default: "#F3F6FA",
            paper: "#FFFFFF",
          },

      text: isDark
        ? {
            primary: "#F1F5F9",
            secondary: "#94A3B8",
            disabled: "#64748B",
          }
        : {
            primary: "#16355B",
            secondary: "#64748B",
            disabled: "#94A3B8",
          },

      divider: isDark
        ? "#334155"
        : "#E2E8F0",
    },

    shape: {
      borderRadius: 12,
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

      h1: {
        fontSize: "1.75rem",
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: "-0.025em",
      },

      h2: {
        fontSize: "1.45rem",
        fontWeight: 800,
        lineHeight: 1.25,
        letterSpacing: "-0.025em",
      },

      h3: {
        fontSize: "1.25rem",
        fontWeight: 800,
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
      },

      h4: {
        fontSize: "1.1rem",
        fontWeight: 800,
        lineHeight: 1.35,
        letterSpacing: "-0.015em",
      },

      h5: {
        fontSize: "1rem",
        fontWeight: 700,
        lineHeight: 1.4,
      },

      h6: {
        fontSize: "0.875rem",
        fontWeight: 700,
        lineHeight: 1.4,
      },

      body1: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },

      body2: {
        fontSize: "0.78rem",
        lineHeight: 1.45,
      },

      button: {
        fontSize: "0.8125rem",
        fontWeight: 700,
        textTransform: "none",
      },

      caption: {
        fontSize: "0.67rem",
        lineHeight: 1.4,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            width: "100%",
            height: "100%",
          },

          body: {
            width: "100%",
            height: "100%",
            margin: 0,
            backgroundColor: isDark
              ? "#0F172A"
              : "#F3F6FA",
          },

          "#root": {
            width: "100%",
            height: "100%",
          },

          "*": {
            boxSizing: "border-box",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: "none",
            boxShadow: isDark
              ? "0 4px 16px rgba(0, 0, 0, 0.22)"
              : "0 4px 16px rgba(15, 23, 42, 0.055)",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: "none",
            boxShadow: isDark
              ? "0 4px 16px rgba(0, 0, 0, 0.22)"
              : "0 4px 16px rgba(15, 23, 42, 0.055)",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 10,
            paddingLeft: 15,
            paddingRight: 15,
            fontWeight: 700,
          },

          contained: {
            boxShadow:
              "0 5px 14px rgba(37, 99, 235, 0.16)",

            "&:hover": {
              boxShadow:
                "0 7px 18px rgba(37, 99, 235, 0.22)",
            },
          },

          outlined: {
            borderColor: isDark
              ? "#475569"
              : "#CBD5E1",

            "&:hover": {
              borderColor: "#2563EB",
              backgroundColor:
                "rgba(37, 99, 235, 0.04)",
            },
          },

          sizeSmall: {
            minHeight: 34,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 8,
          },

          sizeLarge: {
            minHeight: 44,
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 8,
            transition:
              "background-color .18s ease, color .18s ease",
          },

          sizeSmall: {
            padding: 6,
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
            minHeight: 40,
            borderRadius: 10,
            backgroundColor: isDark
              ? "#1E293B"
              : "#F8FAFC",

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#94A3B8",
            },

            "&.Mui-focused": {
              backgroundColor: isDark
                ? "#243247"
                : "#FFFFFF",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1.5,
            },

            "&.MuiInputBase-sizeSmall": {
              minHeight: 36,
            },
          },

          input: {
            paddingTop: 9,
            paddingBottom: 9,
          },

          notchedOutline: {
            borderColor: isDark
              ? "#475569"
              : "#E2E8F0",
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark
              ? "#94A3B8"
              : "#64748B",
            fontSize: "0.82rem",

            "&.Mui-focused": {
              color: "#2563EB",
            },
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          select: {
            fontSize: "0.8125rem",
            fontWeight: 500,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            height: 28,
            borderRadius: 7,
            fontWeight: 700,
            fontSize: "0.72rem",
          },

          sizeSmall: {
            height: 24,
            fontSize: "0.68rem",
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 11,
            borderRadius: 7,
            backgroundColor: "#0F172A",
            padding: "6px 9px",
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            backgroundImage: "none",
          },
        },
      },

      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 56,

            "@media (min-width: 600px)": {
              minHeight: 60,
            },
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            borderRadius: 10,
            boxShadow:
              "0 8px 24px rgba(15, 23, 42, 0.12)",
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: 38,
            borderRadius: 7,
            marginLeft: 3,
            marginRight: 3,
            fontSize: "0.8125rem",
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark
              ? "#334155"
              : "#E2E8F0",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "8px 12px",
            fontSize: "0.78rem",
            borderColor: isDark
              ? "#334155"
              : "#E2E8F0",
          },

          head: {
            fontWeight: 700,
            backgroundColor: isDark
              ? "#1E293B"
              : "#F8FAFC",
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: isDark
                ? "#1E293B"
                : "#F8FAFC",
            },
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 6,
            borderRadius: 6,
          },
        },
      },
    },
  });
}

const theme = createAppTheme("light");

export default theme;