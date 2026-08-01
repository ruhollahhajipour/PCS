export interface LoginRequest {
  username: string;

  password: string;
}

export interface LoginResponse {
  token: string;

  refreshToken?: string;

  fullName: string;

  username: string;

  role: string;

  expiresAt?: string;
}

export interface AuthUser {
  id: number;

  username: string;

  fullName: string;

  email?: string;

  role: string;

  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;

  token?: string;

  user?: AuthUser;
}