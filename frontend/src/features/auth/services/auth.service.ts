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

  refreshToken?: string;
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
    try {
      await http.post(
        "/auth/logout",
        { refreshToken: this.getRefreshToken() }
      );
    }
    finally {
      this.clearSession();
    }
  }


  // =========================================================
  // Refresh Token
  // =========================================================

  async refreshToken(): Promise<LoginResponse> {
    const { data } =
      await http.post<LoginResponse>(
        "/auth/refresh",
        {
          refreshToken: this.getRefreshToken(),
          companyId: this.getActiveCompanyId(),
        }
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

  async selectCompany(companyId: string): Promise<LoginResponse> {
    const { data } =
      await http.post<LoginResponse>(
        "/auth/select-company",
        { companyId }
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

    // Changing the password ends all other sessions; this device receives a
    // fresh refresh token so it stays signed in.
    if (data.refreshToken) {
      localStorage.setItem(
        "pcs-refresh-token",
        data.refreshToken
      );
    }

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

  getActiveCompanyId(): string | null {
    return localStorage.getItem(
      "pcs-active-company-id"
    );
  }


  saveSession(
    response: LoginResponse
  ): void {
    localStorage.setItem(
      "pcs-token",
      response.token
    );

    if (response.activeCompanyId) {
      localStorage.setItem(
        "pcs-active-company-id",
        response.activeCompanyId
      );
    }
    else {
      localStorage.removeItem(
        "pcs-active-company-id"
      );
    }


    // Only login, refresh and change-password return a refresh token. /me and
    // select-company do not, and must not discard the one already stored.
    if (response.refreshToken) {
      localStorage.setItem(
        "pcs-refresh-token",
        response.refreshToken
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

    localStorage.removeItem(
      "pcs-active-company-id"
    );
  }
}


const authService =
  new AuthService();


export default authService;