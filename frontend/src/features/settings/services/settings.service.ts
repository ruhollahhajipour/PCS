import type {
  Settings,
  PmsViewSettings,
} from "../../../types/settings";

const STORAGE_KEY = "pcs-settings";

const DEFAULT_SETTINGS: Settings = {
  companyName: "Kousha Gaman Namavar",

  currency: "USD",

  language: "en",

  direction: "auto",

  calendar: "gregorian",

  dateFormat: "dd/mm/yyyy",

  timeFormat: "24",

  weekStart: "saturday",

  numberFormat: "western",

  theme: "light",

  pageSize: 10,

  pms: {
    timelineScale: "month",

    showTodayLine: true,
    showBaseline: false,
    showCriticalPath: false,
    showMilestones: true,
    showFloat: false,

    defaultWbsExpanded: true,
  },
};

function cloneDefaults(): Settings {
  return {
    ...DEFAULT_SETTINGS,
    pms: {
      ...DEFAULT_SETTINGS.pms,
    },
  };
}

function isValidSettings(value: unknown): value is Settings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Settings>;

  return (
    typeof candidate.companyName === "string" &&
    typeof candidate.currency === "string" &&
    typeof candidate.language === "string" &&
    typeof candidate.direction === "string" &&
    typeof candidate.calendar === "string" &&
    typeof candidate.dateFormat === "string" &&
    typeof candidate.timeFormat === "string" &&
    typeof candidate.weekStart === "string" &&
    typeof candidate.numberFormat === "string" &&
    typeof candidate.theme === "string" &&
    typeof candidate.pageSize === "number" &&
    typeof candidate.pms === "object" &&
    candidate.pms !== null
  );
}

class SettingsService {
  async get(): Promise<Settings> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return cloneDefaults();
      }

      const parsed: unknown = JSON.parse(stored);

      if (!isValidSettings(parsed)) {
        return cloneDefaults();
      }

      return {
        ...cloneDefaults(),
        ...parsed,
        pms: {
          ...cloneDefaults().pms,
          ...parsed.pms,
        },
      };
    } catch {
      return cloneDefaults();
    }
  }

  async save(data: Settings): Promise<void> {
    const normalized: Settings = {
      ...cloneDefaults(),
      ...data,
      pms: {
        ...cloneDefaults().pms,
        ...data.pms,
      },
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalized),
    );
  }

  async update(
    changes: Partial<Settings>,
  ): Promise<Settings> {
    const current = await this.get();

    const updated: Settings = {
      ...current,
      ...changes,
      pms: {
        ...current.pms,
        ...(changes.pms ?? {}),
      },
    };

    await this.save(updated);

    return updated;
  }

  async updatePms(
    changes: Partial<PmsViewSettings>,
  ): Promise<PmsViewSettings> {
    const current = await this.get();

    const pms: PmsViewSettings = {
      ...current.pms,
      ...changes,
    };

    await this.save({
      ...current,
      pms,
    });

    return pms;
  }

  async reset(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  getDefaults(): Settings {
    return cloneDefaults();
  }
}

export default new SettingsService();