import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",

  palette: {
    mode: "light",

    primary: {
      main: "#0F172A",
    },

    secondary: {
      main: "#1976D2",
    },

    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: "Vazirmatn, sans-serif",

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;