import axios from "axios";

const configuredApiUrl =
  import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD) {
  if (!configuredApiUrl) {
    throw new Error(
      "VITE_API_URL must be configured for production builds."
    );
  }

  let parsedApiUrl: URL;

  try {
    parsedApiUrl = new URL(configuredApiUrl);
  }
  catch {
    throw new Error(
      "VITE_API_URL must be an absolute HTTPS URL ending in /api."
    );
  }

  if (
    parsedApiUrl.protocol !== "https:" ||
    parsedApiUrl.pathname.replace(/\\/+$/, "") !== "/api" ||
    parsedApiUrl.search ||
    parsedApiUrl.hash
  ) {
    throw new Error(
      "VITE_API_URL must use HTTPS and point exactly to the API base path ending in /api."
    );
  }
}

const http = axios.create({
  baseURL:
    configuredApiUrl ||
    "/api",

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