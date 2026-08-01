import http from "../../../api/http";

import type {
  LoginRequest,
  LoginResponse,
} from "../../../types/auth";

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
    localStorage.removeItem("pcs-token");
    localStorage.removeItem("pcs-refresh-token");

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

  // ==========================
  // Session Helpers
  // ==========================

  getToken(): string | null {
    return localStorage.getItem("pcs-token");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(
      "pcs-refresh-token"
    );
  }

  saveSession(
    response: LoginResponse
  ) {
    localStorage.setItem(
      "pcs-token",
      response.token
    );

    localStorage.setItem(
      "pcs-refresh-token",
      response.refreshToken ?? ""
    );
  }

  clearSession() {
    localStorage.removeItem("pcs-token");
    localStorage.removeItem(
      "pcs-refresh-token"
    );
  }
}

const authService = new AuthService();

export default authService;