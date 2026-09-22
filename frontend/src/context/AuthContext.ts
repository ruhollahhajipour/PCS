import { createContext } from "react";

import type {
  LoginRequest,
  AuthUser,
} from "../types/auth";


export interface AuthContextType {
  token: string | null;

  refreshToken: string | null;

  user: AuthUser | null;

  isAuthenticated: boolean;

  loading: boolean;

  login: (
    request: LoginRequest
  ) => Promise<void>;

  refreshUser: () => Promise<void>;

  logout: () => Promise<void>;
}


export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );