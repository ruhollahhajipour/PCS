import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  LoginRequest,
  LoginResponse,
} from "../types/auth";

import AuthService from "../features/auth/services/auth.service";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;

  isAuthenticated: boolean;
  loading: boolean;

  login: (
    request: LoginRequest
  ) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] =
    useState<string | null>(null);

  const [refreshToken, setRefreshToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const access =
      AuthService.getToken();

    const refresh =
      localStorage.getItem(
        "pcs-refresh-token"
      );

    setToken(access);

    setRefreshToken(refresh);

    setLoading(false);
  }, []);

  async function login(
    request: LoginRequest
  ) {
    const response: LoginResponse =
      await AuthService.login(request);

    AuthService.saveSession(response);

    setToken(response.token);

    setRefreshToken(
      response.refreshToken ?? null
    );
  }

  async function logout() {
    await AuthService.logout();

    localStorage.removeItem(
      "pcs-token"
    );

    localStorage.removeItem(
      "pcs-refresh-token"
    );

    setToken(null);

    setRefreshToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,

        isAuthenticated: !!token,
        loading,

        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}