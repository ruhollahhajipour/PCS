import type { ReactNode } from "react";

import { AuthProvider } from "./AuthProvider";
import { SettingsProvider } from "./SettingsContext";
import { WorkspaceProvider } from "./WorkspaceProvider";

interface AppProvidersProps {
    children: ReactNode;
}

export default function AppProviders({
    children,
}: AppProvidersProps) {
    // Avoid mounting the authenticated workspace providers on the public demo.
    // WorkspaceProvider clears the saved workspace for unauthenticated users.
    const isPublicPreview =
        /^\/preview\/?$/.test(window.location.pathname);

    if (isPublicPreview) {
        return (
            <SettingsProvider>
                {children}
            </SettingsProvider>
        );
    }

    return (
        <AuthProvider>
            <SettingsProvider>
                <WorkspaceProvider>
                    {children}
                </WorkspaceProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}
