export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;

  refreshToken?: string;

  username: string;

  fullName: string;

  userId: string;

  roles: string[];

  permissions: string[];

  expiresAt?: string;

  mustChangePassword: boolean;
}

export interface AuthUser {
  id: string;

  username: string;

  fullName: string;

  email?: string;

  roles: string[];

  permissions: string[];

  avatar?: string;

  mustChangePassword: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;

  token?: string;

  user?: AuthUser;
}