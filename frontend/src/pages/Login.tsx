import { Navigate } from "react-router-dom";

/**
 * TEMPORARY DEVELOPMENT MODE
 * Login UI is disabled while PCS modules are being completed.
 * AuthProvider, JWT services and backend authentication are retained
 * so the original authentication flow can be restored later.
 */
export default function Login() {
  return <Navigate to="/dashboard" replace />;
}
