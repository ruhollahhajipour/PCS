import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { describe, expect, it, vi } from "vitest";

import { installRefreshInterceptor } from "./refreshInterceptor";

function memoryStorage(initial: Record<string, string>) {
  const data = new Map(Object.entries(initial));

  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    snapshot: () => Object.fromEntries(data),
  };
}

interface Call {
  url: string;
  authorization: string | undefined;
  body: unknown;
}

type Handler = (call: Call) => { status: number; data?: unknown } | "network";

function setup(
  initial: Record<string, string>,
  handler: Handler
): {
  http: AxiosInstance;
  storage: ReturnType<typeof memoryStorage>;
  calls: Call[];
  expired: ReturnType<typeof vi.fn>;
} {
  const storage = memoryStorage(initial);
  const calls: Call[] = [];
  const expired = vi.fn();

  const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
    const call: Call = {
      url: config.url ?? "",
      authorization: config.headers.get("Authorization") as string | undefined,
      body: config.data ? JSON.parse(config.data as string) : undefined,
    };
    calls.push(call);

    const result = handler(call);

    if (result === "network") {
      throw new AxiosError("Network Error", "ERR_NETWORK", config);
    }

    const response = {
      status: result.status,
      statusText: "",
      data: result.data ?? {},
      headers: {},
      config,
    };

    if (result.status >= 400) {
      throw new AxiosError(
        `status ${result.status}`,
        "ERR_BAD_REQUEST",
        config,
        null,
        response
      );
    }

    return response;
  };

  const http = axios.create({ baseURL: "/api", adapter });

  // Mirrors the request interceptor in http.ts.
  http.interceptors.request.use((config) => {
    const token = storage.getItem("pcs-token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  installRefreshInterceptor(http, { storage, onSessionExpired: expired });

  return { http, storage, calls, expired };
}

const loggedIn = {
  "pcs-token": "old-access",
  "pcs-refresh-token": "old-refresh",
  "pcs-active-company-id": "company-1",
};

describe("refresh interceptor", () => {
  it("refreshes once on 401 and replays the request with the new token", async () => {
    const { http, storage, calls } = setup(loggedIn, (call) => {
      if (call.url === "/auth/refresh") {
        return {
          status: 200,
          data: { token: "new-access", refreshToken: "new-refresh" },
        };
      }

      return call.authorization === "Bearer new-access"
        ? { status: 200, data: { ok: true } }
        : { status: 401 };
    });

    const response = await http.get("/projects");

    expect(response.data).toEqual({ ok: true });
    expect(storage.snapshot()["pcs-token"]).toBe("new-access");
    expect(storage.snapshot()["pcs-refresh-token"]).toBe("new-refresh");

    const refreshCall = calls.find((c) => c.url === "/auth/refresh");
    expect(refreshCall?.body).toEqual({
      refreshToken: "old-refresh",
      companyId: "company-1",
    });
    expect(calls.map((c) => c.url)).toEqual([
      "/projects",
      "/auth/refresh",
      "/projects",
    ]);
  });

  it("shares one refresh between concurrent failing requests", async () => {
    const { http, calls } = setup(loggedIn, (call) => {
      if (call.url === "/auth/refresh") {
        return {
          status: 200,
          data: { token: "new-access", refreshToken: "new-refresh" },
        };
      }

      return call.authorization === "Bearer new-access"
        ? { status: 200 }
        : { status: 401 };
    });

    await Promise.all([http.get("/a"), http.get("/b"), http.get("/c")]);

    expect(calls.filter((c) => c.url === "/auth/refresh")).toHaveLength(1);
  });

  it("clears the session and signals expiry when the refresh token is rejected", async () => {
    const { http, storage, expired } = setup(loggedIn, () => ({ status: 401 }));

    await expect(http.get("/projects")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(storage.snapshot()).toEqual({});
    expect(expired).toHaveBeenCalledTimes(1);
  });

  it("keeps the session on a network failure during refresh", async () => {
    const { http, storage, expired } = setup(loggedIn, (call) =>
      call.url === "/auth/refresh" ? "network" : { status: 401 }
    );

    await expect(http.get("/projects")).rejects.toBeDefined();

    expect(storage.snapshot()["pcs-refresh-token"]).toBe("old-refresh");
    expect(expired).not.toHaveBeenCalled();
  });

  it("does not try to refresh without a refresh token", async () => {
    const { http, calls } = setup({ "pcs-token": "old-access" }, () => ({
      status: 401,
    }));

    await expect(http.get("/projects")).rejects.toBeDefined();

    expect(calls).toHaveLength(1);
  });

  it("does not refresh for a failed login", async () => {
    const { http, calls } = setup(loggedIn, () => ({ status: 401 }));

    await expect(http.post("/auth/login", {})).rejects.toBeDefined();

    expect(calls).toHaveLength(1);
  });

  it("reuses a token another tab already refreshed", async () => {
    const { http, storage, calls } = setup(loggedIn, (call) => {
      if (call.authorization === "Bearer tab-two-access") {
        return { status: 200 };
      }

      // The other tab rotates tokens while this request is failing.
      storage.setItem("pcs-token", "tab-two-access");
      storage.setItem("pcs-refresh-token", "tab-two-refresh");
      return { status: 401 };
    });

    await http.get("/projects");

    expect(calls.some((c) => c.url === "/auth/refresh")).toBe(false);
  });
});
