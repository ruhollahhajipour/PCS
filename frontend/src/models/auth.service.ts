import type {
  LoginRequest,
  LoginResponse,
} from "../models/auth";

class AuthService {
  async login(
    request: LoginRequest
  ): Promise<LoginResponse> {
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    return {
      token: "pcs-access-token",

      refreshToken: "pcs-refresh-token",

      user: {
        id: 1,

        username: request.username,

        fullName: "System Administrator",

        role: "Admin",

        companyId: 1,

        plantId: 1,
      },
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem("pcs-token");

    localStorage.removeItem(
      "pcs-refresh-token"
    );

    localStorage.removeItem("pcs-user");
  }

  async me() {
    const user =
      localStorage.getItem("pcs-user");

    if (!user) return null;

    return JSON.parse(user);
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
      response.refreshToken
    );

    localStorage.setItem(
      "pcs-user",
      JSON.stringify(response.user)
    );
  }

  getToken() {
    return localStorage.getItem(
      "pcs-token"
    );
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();