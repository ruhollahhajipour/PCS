import React from "react";

import {
    CssBaseline,
    ThemeProvider,
} from "@mui/material";

import App from "../App";
import { useSettings } from "../context/SettingsContext";
import { createAppTheme } from "./theme";

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


export default AppTheme;
