import type { ReactNode } from "react";

import { AuthProvider } from "./AuthContext";
import { WorkspaceProvider } from "./WorkspaceContext";

interface Props {
  children: ReactNode;
}

export default function AppProviders({
  children,
}: Props) {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    </AuthProvider>
  );
}