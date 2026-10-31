import React from "react";
import ReactDOM from "react-dom/client";

import AppTheme from "./theme/AppTheme";

import AppProviders from "./context/AppProviders";
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