import React from "react";
import ReactDOM from "react-dom/client";

import {
    CssBaseline,
    ThemeProvider,
} from "@mui/material";

import App from "./App";

import { createAppTheme } from "./theme/theme";

import AppProviders from "./context/AppProviders";
import { useSettings } from "./context/SettingsContext";

import "./index.css";

function AppTheme() {
    const { settings } = useSettings();

    const systemPrefersDark =
        window.matchMedia?.(
            "(prefers-color-scheme: dark)",
        ).matches ?? false;

    const resolvedMode =
        settings.theme === "system"
            ? systemPrefersDark
                ? "dark"
                : "light"
            : settings.theme;

    const theme = React.useMemo(
        () => createAppTheme(resolvedMode),
        [resolvedMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <App />
        </ThemeProvider>
    );
}

ReactDOM.createRoot(
    document.getElementById("root")!,
).render(
    <React.StrictMode>
        <AppProviders>
            <AppTheme />
        </AppProviders>
    </React.StrictMode>,
);