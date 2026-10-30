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
    // The public preview must not mount AuthProvider or WorkspaceProvider:
    // WorkspaceProvider clears the saved workspace for unauthenticated users.
    // Keeping preview isolated also guarantees that it never calls the API.
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
