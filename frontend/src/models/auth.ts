export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;

  user: {
    id: number;

    username: string;

    fullName: string;

    role: string;

    companyId: number;

    plantId: number;
  };
}

export interface AuthState {
  token: string | null;

  refreshToken: string | null;

  isAuthenticated: boolean;

  loading: boolean;
}