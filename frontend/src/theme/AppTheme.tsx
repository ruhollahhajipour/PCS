import React from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";

import App from "../App";
import { useSettings } from "../context/useSettings";
import { createAppTheme } from "./theme";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export default function AppTheme() {
    const { settings } = useSettings();
    const [systemPrefersDark, setSystemPrefersDark] = React.useState(
        () => window.matchMedia?.(COLOR_SCHEME_QUERY).matches ?? false,
    );

    React.useEffect(() => {
        if (typeof window.matchMedia !== "function") return;
        const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
        const updatePreference = () => setSystemPrefersDark(mediaQuery.matches);
        updatePreference();

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", updatePreference);
            return () => mediaQuery.removeEventListener("change", updatePreference);
        }

        mediaQuery.addListener(updatePreference);
        return () => mediaQuery.removeListener(updatePreference);
    }, []);

    const resolvedMode =
        settings.theme === "system"
            ? systemPrefersDark ? "dark" : "light"
            : settings.theme;
    const theme = React.useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}
