import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(error);

    return Promise.reject(error);
  }
);

export default http;