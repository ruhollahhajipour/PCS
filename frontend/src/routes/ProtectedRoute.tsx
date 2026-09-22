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


  const location =
    useLocation();


  // -----------------------------------------
  // Authentication state is still loading
  // -----------------------------------------

  if (loading) {
    return null;
  }


  // -----------------------------------------
  // User is not authenticated
  // -----------------------------------------

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }


  // -----------------------------------------
  // Initial password must be changed
  //
  // Allow the dedicated password page,
  // but block every other protected route.
  // -----------------------------------------

  if (
    user?.mustChangePassword === true &&
    location.pathname !==
      "/change-password"
  ) {
    return (
      <Navigate
        to="/change-password"
        replace
      />
    );
  }


  // -----------------------------------------
  // Authenticated
  // -----------------------------------------

  return (
    <>
      {children}
    </>
  );
}