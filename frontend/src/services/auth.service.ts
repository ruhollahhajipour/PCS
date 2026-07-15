import http from "../api/http";

import type {
  LoginRequest,
  LoginResponse,
} from "../types/auth";

class AuthService {
  async login(
    request: LoginRequest
  ): Promise<LoginResponse> {
    const { data } =
      await http.post<LoginResponse>(
        "/auth/login",
        request
      );

    return data;
  }

  async logout(): Promise<void> {
    await http.post("/auth/logout");
  }

  async refreshToken(): Promise<LoginResponse> {
    const { data } =
      await http.post<LoginResponse>(
        "/auth/refresh"
      );

    return data;
  }

  async me(): Promise<LoginResponse> {
    const { data } =
      await http.get<LoginResponse>(
        "/auth/me"
      );

    return data;
  }
}

const authService = new AuthService();

export default authService;