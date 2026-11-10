import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export const SESSION_EXPIRED_EVENT = "pcs:session-expired";

const TOKEN_KEY = "pcs-token";
const REFRESH_KEY = "pcs-refresh-token";
const COMPANY_KEY = "pcs-active-company-id";

// These endpoints never trigger a refresh: a 401 from them is the answer.
const AUTH_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export interface RefreshInterceptorOptions {
  storage?: StorageLike;
  onSessionExpired?: () => void;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _pcsRetried?: boolean;
  // The refresh token that was current when the request was sent. Another tab
  // may rotate it while the request is in flight.
  _pcsRefreshAtSend?: string | null;
}

interface RefreshResponse {
  token?: string;
  refreshToken?: string;
  activeCompanyId?: string | null;
}

function defaultNotify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

function isAuthPath(url: string | undefined): boolean {
  return AUTH_PATHS.some((path) => url?.includes(path));
}

/**
 * When a request fails with 401 and the user has a refresh token, exchanges it
 * for a new session once (shared by all requests that failed at the same time)
 * and replays the request. If the refresh token is rejected the stored session
 * is cleared and `onSessionExpired` fires; a network error or server fault
 * keeps the session so a brief outage does not sign the user out.
 */
export function installRefreshInterceptor(
  instance: AxiosInstance,
  options: RefreshInterceptorOptions = {}
): void {
  const storage: StorageLike = options.storage ?? localStorage;
  const notify = options.onSessionExpired ?? defaultNotify;

  let inflight: Promise<boolean> | null = null;

  async function exchange(used: string): Promise<boolean> {
    // Another tab may have refreshed while this request was failing.
    const stored = storage.getItem(REFRESH_KEY);

    if (stored && stored !== used) {
      return true;
    }

    // A client without interceptors, so the call cannot loop.
    const bare = axios.create({
      baseURL: instance.defaults.baseURL,
      timeout: instance.defaults.timeout,
      adapter: instance.defaults.adapter,
      headers: { "Content-Type": "application/json" },
    });

    try {
      const { data } = await bare.post<RefreshResponse>("/auth/refresh", {
        refreshToken: used,
        companyId: storage.getItem(COMPANY_KEY),
      });

      if (!data.token || !data.refreshToken) {
        return false;
      }

      storage.setItem(TOKEN_KEY, data.token);
      storage.setItem(REFRESH_KEY, data.refreshToken);

      if (data.activeCompanyId) {
        storage.setItem(COMPANY_KEY, data.activeCompanyId);
      }

      return true;
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === 401 || status === 403) {
        // Lost a race with another tab that already rotated the token.
        const latest = storage.getItem(REFRESH_KEY);

        if (latest && latest !== used) {
          return true;
        }

        storage.removeItem(TOKEN_KEY);
        storage.removeItem(REFRESH_KEY);
        storage.removeItem(COMPANY_KEY);
        notify();
      }

      return false;
    }
  }

  instance.interceptors.request.use((config) => {
    const retriable = config as RetriableConfig;

    if (retriable._pcsRefreshAtSend === undefined) {
      retriable._pcsRefreshAtSend = storage.getItem(REFRESH_KEY);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        throw error;
      }

      const config = error.config as RetriableConfig | undefined;
      const used = config?._pcsRefreshAtSend;

      if (
        error.response?.status !== 401 ||
        !config ||
        config._pcsRetried ||
        isAuthPath(config.url) ||
        !used
      ) {
        throw error;
      }

      config._pcsRetried = true;

      inflight ??= exchange(used).finally(() => {
        inflight = null;
      });

      if (!(await inflight)) {
        throw error;
      }

      // The request interceptor attaches the new access token.
      return instance.request(config);
    }
  );
}

