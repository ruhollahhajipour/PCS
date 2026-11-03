import axios from "axios";
import { resolveApiBaseUrl } from "./apiBaseUrl";

const apiBaseUrl = resolveApiBaseUrl(
  import.meta.env.VITE_API_URL,
  import.meta.env.PROD
);

const http = axios.create({
  baseURL: apiBaseUrl,

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("pcs-token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    let companyId =
      localStorage.getItem("pcs-active-company-id");

    if (!companyId) {
      try {
        const storedWorkspace = JSON.parse(
          localStorage.getItem("pcs.workspace") ?? "null"
        );

        companyId =
          storedWorkspace?.company?.id ?? null;
      }
      catch {
        companyId = null;
      }
    }

    if (companyId) {
      config.headers["X-PCS-CompanyId"] = companyId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("API ERROR", error);

    return Promise.reject(error);
  }
);

export default http;