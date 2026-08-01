import React from "react";
import ReactDOM from "react-dom/client";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App";

import theme from "./theme/theme";

import { AuthProvider } from "./context/AuthContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";

import "./index.css";


ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>

    <ThemeProvider theme={theme}>

      <CssBaseline />

      <AuthProvider>

        <WorkspaceProvider>

          <App />

        </WorkspaceProvider>

      </AuthProvider>


    </ThemeProvider>


  </React.StrictMode>

);