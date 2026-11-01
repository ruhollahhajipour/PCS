import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";

import AppProviders from "./context/AppProviders";
import AppTheme from "./theme/AppTheme";

import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")!,
).render(
    <React.StrictMode>
        <AppProviders>
            <AppTheme />
        </AppProviders>
    </React.StrictMode>,
);
