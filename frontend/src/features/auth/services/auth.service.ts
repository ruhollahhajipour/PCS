import http from "../../../api/http";

import type {
  LoginRequest,
  LoginResponse,
} from "../../../types/auth";


export interface ChangePasswordRequest {
  currentPassword: string;

  newPassword: string;
}


export interface ChangePasswordResponse {
  message: string;
}


class AuthService {

  // =========================================================
  // Login
  // =========================================================

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


  // =========================================================
  // Logout
  // =========================================================

  async logout(): Promise<void> {
    await http.post(
      "/auth/logout"
    );

    this.clearSession();
  }


  // =========================================================
  // Refresh Token
  // =========================================================

  async refreshToken(): Promise<LoginResponse> {
    const { data } =
      await http.post<LoginResponse>(
        "/auth/refresh"
      );

    return data;
  }


  // =========================================================
  // Current User
  // =========================================================

  async me(): Promise<LoginResponse> {
    const { data } =
      await http.get<LoginResponse>(
        "/auth/me"
      );

    return data;
  }


  // =========================================================
  // Change Password
  // =========================================================

  async changePassword(
    request: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    const { data } =
      await http.post<ChangePasswordResponse>(
        "/auth/change-password",
        request
      );

    return data;
  }


  // =========================================================
  // Session Helpers
  // =========================================================

  getToken(): string | null {
    return localStorage.getItem(
      "pcs-token"
    );
  }


  getRefreshToken(): string | null {
    return localStorage.getItem(
      "pcs-refresh-token"
    );
  }


  saveSession(
    response: LoginResponse
  ): void {
    localStorage.setItem(
      "pcs-token",
      response.token
    );


    if (response.refreshToken) {
      localStorage.setItem(
        "pcs-refresh-token",
        response.refreshToken
      );
    }
    else {
      localStorage.removeItem(
        "pcs-refresh-token"
      );
    }
  }


  clearSession(): void {
    localStorage.removeItem(
      "pcs-token"
    );

    localStorage.removeItem(
      "pcs-refresh-token"
    );
  }
}


const authService =
  new AuthService();


export default authService;