export type ColorTokens = {
  primary: string;
  primaryHover: string;
  primarySoft: string;
  primaryMuted: string;
  secondary: string;
  secondaryHover: string;
  secondarySoft: string;
  sidebar: string;
  sidebarSurface: string;
  sidebarSurfaceAlt: string;
  sidebarHover: string;
  sidebarActive: string;
  sidebarText: string;
  sidebarTextMuted: string;
  sidebarTextDim: string;
  background: string;
  backgroundSoft: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  info: string;
  infoSoft: string;
  border: string;
  borderStrong: string;
  borderSoft: string;
  chartBlue: string;
  chartCyan: string;
  chartGreen: string;
  chartAmber: string;
  chartRed: string;
  chartSlate: string;
  overlay: string;
  white: string;
  black: string;
};

const light: ColorTokens = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  primarySoft: "#EFF6FF",
  primaryMuted: "#DBEAFE",
  secondary: "#475569",
  secondaryHover: "#334155",
  secondarySoft: "#F1F5F9",
  sidebar: "#0F172A",
  sidebarSurface: "#162235",
  sidebarSurfaceAlt: "#1B2A3D",
  sidebarHover: "rgba(255,255,255,.055)",
  sidebarActive: "#2563EB",
  sidebarText: "#D8E3EF",
  sidebarTextMuted: "#91A4BA",
  sidebarTextDim: "#657A91",
  background: "#F6F8FB",
  backgroundSoft: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  surfaceHover: "#F1F5F9",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textInverse: "#FFFFFF",
  success: "#16A34A",
  successSoft: "#F0FDF4",
  warning: "#D97706",
  warningSoft: "#FFFBEB",
  error: "#DC2626",
  errorSoft: "#FEF2F2",
  info: "#0284C7",
  infoSoft: "#F0F9FF",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  borderSoft: "#EEF2F7",
  chartBlue: "#2563EB",
  chartCyan: "#0891B2",
  chartGreen: "#16A34A",
  chartAmber: "#D97706",
  chartRed: "#DC2626",
  chartSlate: "#64748B",
  overlay: "rgba(15,23,42,.42)",
  white: "#FFFFFF",
  black: "#000000",
};

const dark: ColorTokens = {
  primary: "#60A5FA",
  primaryHover: "#93C5FD",
  primarySoft: "rgba(37,99,235,.18)",
  primaryMuted: "rgba(96,165,250,.24)",
  secondary: "#A8B5C7",
  secondaryHover: "#CBD5E1",
  secondarySoft: "#243247",
  sidebar: "#080F1B",
  sidebarSurface: "#111C2E",
  sidebarSurfaceAlt: "#172338",
  sidebarHover: "rgba(255,255,255,.07)",
  sidebarActive: "#2563EB",
  sidebarText: "#E2E8F0",
  sidebarTextMuted: "#A6B5C8",
  sidebarTextDim: "#71839B",
  background: "#0B1220",
  backgroundSoft: "#0F172A",
  surface: "#111C2E",
  surfaceMuted: "#172338",
  surfaceHover: "#1E293B",
  textPrimary: "#E2E8F0",
  textSecondary: "#B6C3D2",
  textMuted: "#8192A8",
  textInverse: "#0B1220",
  success: "#4ADE80",
  successSoft: "rgba(22,163,74,.16)",
  warning: "#FBBF24",
  warningSoft: "rgba(217,119,6,.16)",
  error: "#F87171",
  errorSoft: "rgba(220,38,38,.16)",
  info: "#38BDF8",
  infoSoft: "rgba(2,132,199,.16)",
  border: "#263449",
  borderStrong: "#3A4B63",
  borderSoft: "#1B2A3D",
  chartBlue: "#60A5FA",
  chartCyan: "#22D3EE",
  chartGreen: "#4ADE80",
  chartAmber: "#FBBF24",
  chartRed: "#F87171",
  chartSlate: "#94A3B8",
  overlay: "rgba(2,6,23,.68)",
  white: "#FFFFFF",
  black: "#000000",
};

export const colorTokens = { light, dark };
export type ThemeMode = keyof typeof colorTokens;

// Backward-compatible light palette export.
export default light;
