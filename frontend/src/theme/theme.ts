import { createTheme } from "@mui/material/styles";

import { colorTokens } from "./colors";
import type { ThemeMode } from "./colors";
import typography, { fontFamily } from "./typography";

export type { ThemeMode };

export function createAppTheme(mode: ThemeMode = "light") {
  const tokens = colorTokens[mode];
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        dark: isDark ? "#3B82F6" : tokens.primaryHover,
        light: isDark ? "#93C5FD" : "#60A5FA",
        contrastText: isDark ? "#0B1220" : tokens.white,
      },
      secondary: {
        main: isDark ? "#A5B4FC" : "#4F46E5",
        dark: isDark ? "#818CF8" : "#4338CA",
        light: isDark ? "#C7D2FE" : "#818CF8",
        contrastText: isDark ? "#0B1220" : tokens.white,
      },
      success: { main: tokens.success },
      warning: { main: tokens.warning },
      error: { main: tokens.error },
      info: { main: tokens.info },
      background: {
        default: tokens.background,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
        disabled: tokens.textMuted,
      },
      divider: tokens.border,
      action: {
        hover: tokens.surfaceHover,
        selected: tokens.primarySoft,
        disabled: tokens.textMuted,
        disabledBackground: tokens.surfaceMuted,
      },
    },
    shape: { borderRadius: 10 },
    typography,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            width: "100%",
            height: "100%",
            colorScheme: mode,
          },
          body: {
            width: "100%",
            height: "100%",
            minWidth: 320,
            margin: 0,
            backgroundColor: tokens.background,
            color: tokens.textPrimary,
            fontFamily,
            "--pcs-scrollbar-thumb": tokens.borderStrong,
            "--pcs-scrollbar-thumb-hover": tokens.textMuted,
            "--pcs-selection-background": tokens.primaryMuted,
          },
          "#root": {
            width: "100%",
            height: "100%",
          },
          "*": { boxSizing: "border-box" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            color: tokens.textPrimary,
            backgroundImage: "none",
            borderColor: tokens.border,
            boxShadow: isDark
              ? "0 4px 16px rgba(0,0,0,.22)"
              : "0 4px 16px rgba(15,23,42,.055)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${tokens.border}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 9,
            paddingLeft: 15,
            paddingRight: 15,
            fontWeight: 650,
          },
          contained: {
            boxShadow: "0 5px 14px rgba(37,99,235,.16)",
            "&:hover": {
              boxShadow: "0 7px 18px rgba(37,99,235,.22)",
            },
          },
          outlined: {
            borderColor: tokens.borderStrong,
            "&:hover": {
              borderColor: tokens.primary,
              backgroundColor: tokens.primarySoft,
            },
          },
          sizeSmall: {
            minHeight: 34,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 8,
          },
          sizeLarge: { minHeight: 44 },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 8,
            transition: "background-color .18s ease, color .18s ease",
          },
          sizeSmall: { padding: 6 },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 9,
            color: tokens.textPrimary,
            backgroundColor: tokens.surfaceMuted,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: tokens.borderStrong,
            },
            "&.Mui-focused": {
              backgroundColor: tokens.surface,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1.5,
            },
            "&.MuiInputBase-sizeSmall": { minHeight: 36 },
          },
          input: {
            paddingTop: 9,
            paddingBottom: 9,
            "&::placeholder": {
              color: tokens.textMuted,
              opacity: 1,
            },
          },
          notchedOutline: { borderColor: tokens.border },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: tokens.textSecondary,
            fontSize: "0.82rem",
            "&.Mui-focused": { color: tokens.primary },
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
            backgroundColor: isDark ? "#E2E8F0" : "#0F172A",
            color: isDark ? "#0F172A" : "#FFFFFF",
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
            "@media (min-width: 600px)": { minHeight: 60 },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            borderRadius: 10,
            border: `1px solid ${tokens.border}`,
            boxShadow: isDark
              ? "0 8px 24px rgba(0,0,0,.28)"
              : "0 8px 24px rgba(15,23,42,.12)",
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
          root: { borderColor: tokens.border },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "8px 12px",
            fontSize: "0.78rem",
            borderColor: tokens.border,
          },
          head: {
            fontWeight: 700,
            color: tokens.textPrimary,
            backgroundColor: tokens.surfaceMuted,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": { backgroundColor: tokens.surfaceHover },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: 6,
            borderRadius: 6,
            backgroundColor: tokens.primarySoft,
          },
        },
      },
    },
  });
}

const theme = createAppTheme("light");

export default theme;
