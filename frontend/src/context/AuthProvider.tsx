import {
  useEffect,
  useState,
  type ReactNode,
} from "react";


import type {
  LoginRequest,
  LoginResponse,
  AuthUser,
} from "../types/auth";


import AuthService
  from "../features/auth/services/auth.service";


import {
  AuthContext,
} from "./AuthContext";


// =============================================================
// Create Auth User
// =============================================================

function createUser(
  response: LoginResponse
): AuthUser {
  return {
    id:
      response.userId,

    username:
      response.username,

    fullName:
      response.fullName,

    roles:
      response.roles ?? [],

    permissions:
      response.permissions ?? [],

    mustChangePassword:
      response.mustChangePassword === true,
  };
}


// =============================================================
// Auth Provider
// =============================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [
    token,
    setToken,
  ] = useState<string | null>(
    () =>
      AuthService.getToken()
  );


  const [
    refreshToken,
    setRefreshToken,
  ] = useState<string | null>(
    () =>
      AuthService.getRefreshToken()
  );


  const [
    user,
    setUser,
  ] = useState<AuthUser | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  // ===========================================================
  // Apply Authentication Response
  // ===========================================================

  function applyAuthenticationResponse(
    response: LoginResponse
  ): void {

    AuthService.saveSession(
      response
    );


    setToken(
      response.token
    );


    setRefreshToken(
      response.refreshToken ?? null
    );


    setUser(
      createUser(response)
    );
  }


  // ===========================================================
  // Restore Existing Authentication Session
  // ===========================================================

  useEffect(() => {

    let mounted = true;


    async function restoreSession() {

      // The public visual preview is intentionally backend-free.
      // Do not attempt to restore a previously saved API session there.
      if (window.location.pathname === "/preview") {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      const existingToken =
        AuthService.getToken();


      if (!existingToken) {

        if (mounted) {
          setLoading(false);
        }

        return;
      }


      try {

        const response =
          await AuthService.me();


        if (!mounted) {
          return;
        }


        /*
         * /auth/me returns a fresh authentication
         * response including the current user state.
         *
         * Save the returned token because the backend
         * generates a new JWT for the current session.
         */

        applyAuthenticationResponse(
          response
        );

      }
      catch (error) {

        console.warn(
          "AUTH SESSION RESTORE FAILED",
          error
        );


        if (!mounted) {
          return;
        }


        AuthService.clearSession();


        setToken(null);

        setRefreshToken(null);

        setUser(null);

      }
      finally {

        if (mounted) {
          setLoading(false);
        }
      }
    }


    restoreSession();


    return () => {
      mounted = false;
    };

  }, []);


  // ===========================================================
  // Login
  // ===========================================================

  async function login(
    request: LoginRequest
  ): Promise<void> {

    const response:
      LoginResponse =
        await AuthService.login(
          request
        );


    applyAuthenticationResponse(
      response
    );
  }


  // ===========================================================
  // Refresh Current User
  // ===========================================================

  async function refreshUser(): Promise<void> {

    const existingToken =
      AuthService.getToken();


    if (!existingToken) {

      AuthService.clearSession();

      setToken(null);

      setRefreshToken(null);

      setUser(null);

      return;
    }


    const response =
      await AuthService.me();


    applyAuthenticationResponse(
      response
    );
  }


  // ===========================================================
  // Logout
  // ===========================================================

  async function logout(): Promise<void> {

    try {

      await AuthService.logout();

    }
    finally {

      AuthService.clearSession();


      setToken(null);

      setRefreshToken(null);

      setUser(null);
    }
  }


  // ===========================================================
  // Context
  // ===========================================================

  return (
    <AuthContext.Provider
      value={{
        token,

        refreshToken,

        user,

        isAuthenticated:
          !!token,

        loading,

        login,

        refreshUser,

        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}