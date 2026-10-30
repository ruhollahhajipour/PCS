import type { ReactNode } from "react";

/**
 * TEMPORARY DEVELOPMENT MODE
 * Authentication is intentionally bypassed on the isolated preview branch.
 * Restore the original guard before enabling production access.
 */
type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  return <>{children}</>;
}
