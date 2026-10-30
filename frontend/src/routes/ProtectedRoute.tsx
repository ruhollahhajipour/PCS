import type {
  ReactNode,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/useAuth";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const {
    isAuthenticated,
    loading,
    user,
  } = useAuth();

  const location = useLocation();

  // Frontend-only access for the dedicated Vercel Preview branch.
  // Backend JWT authentication and permission policies remain enabled.
  if (__PCS_PREVIEW_AUTH_BYPASS__) {
    return <>{children}</>;
  }

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (
    user?.mustChangePassword === true &&
    location.pathname !== "/change-password"
  ) {
    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }

  return <>{children}</>;
}
