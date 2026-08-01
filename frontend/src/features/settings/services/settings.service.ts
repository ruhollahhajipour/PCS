export interface Settings {
  companyName: string;
  currency: string;
  language: string;
  theme: "light" | "dark";
  pageSize: number;
}

let settings: Settings = {
  companyName: "Kousha Gaman Namavar",
  currency: "USD",
  language: "en",
  theme: "light",
  pageSize: 10,
};

class SettingsService {
  async get(): Promise<Settings> {
    return Promise.resolve(settings);
  }

  async save(data: Settings): Promise<void> {
    settings = data;
    return Promise.resolve();
  }

  async reset(): Promise<void> {
    settings = {
      companyName: "Kousha Gaman Namavar",
      currency: "USD",
      language: "en",
      theme: "light",
      pageSize: 10,
    };

    return Promise.resolve();
  }
}

export default new SettingsService();