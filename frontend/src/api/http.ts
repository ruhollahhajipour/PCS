import axios from "axios";

const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
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