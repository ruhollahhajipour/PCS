const AppConfig = {
  appName: "PCS",

  version: "1.0.0",

  company: "Kousha Gaman Namavar",

  apiUrl:
    import.meta.env.VITE_API_URL ??
    "http://localhost:5000/api",

  dateFormat: "DD MMM YYYY",

  currency: "USD",

  language: "en",

  pageSize: 10,

  theme: "light",
};

export default AppConfig;