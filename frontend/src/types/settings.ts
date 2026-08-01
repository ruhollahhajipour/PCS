export interface Settings {
  companyName: string;

  currency: string;

  language: string;

  theme: "light" | "dark";

  pageSize: number;
}

export interface ThemeSettings {
  mode: "light" | "dark";

  primaryColor: string;

  secondaryColor: string;
}

export interface LocalizationSettings {
  language: string;

  dateFormat: string;

  timeFormat: string;

  numberFormat: string;
}