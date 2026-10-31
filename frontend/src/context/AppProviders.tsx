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