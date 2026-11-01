import React from "react";
import ReactDOM from "react-dom/client";

import {
    CssBaseline,
    ThemeProvider,
} from "@mui/material";

import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";

import App from "./App";
import { createAppTheme } from "./theme/theme";
import AppProviders from "./context/AppProviders";
import { useSettings } from "./context/SettingsContext";

import "./index.css";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

function AppTheme() {
    const { settings } = useSettings();

    const [systemPrefersDark, setSystemPrefersDark] =
        React.useState(() =>
            window.matchMedia?.(COLOR_SCHEME_QUERY).matches ?? false
        );

    React.useEffect(() => {
        if (typeof window.matchMedia !== "function") {
            return;
        }

        const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
        const updatePreference = () => {
            setSystemPrefersDark(mediaQuery.matches);
        };

        updatePreference();

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", updatePreference);
            return () => {
                mediaQuery.removeEventListener("change", updatePreference);
            };
        }

        mediaQuery.addListener(updatePreference);
        return () => {
            mediaQuery.removeListener(updatePreference);
        };
    }, []);

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
