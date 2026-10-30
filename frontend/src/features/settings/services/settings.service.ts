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

function isOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
): value is T {
  return typeof value === "string" &&
    allowed.includes(value as T);
}

function isValidSettings(value: unknown): value is Settings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Settings>;
  const pms = candidate.pms;

  if (!pms || typeof pms !== "object") {
    return false;
  }

  return (
    typeof candidate.companyName === "string" &&
    typeof candidate.currency === "string" &&
    isOneOf(candidate.language, ["en", "fa", "ar"] as const) &&
    isOneOf(candidate.direction, ["auto", "ltr", "rtl"] as const) &&
    isOneOf(candidate.calendar, ["gregorian", "persian"] as const) &&
    isOneOf(candidate.dateFormat, [
      "yyyy-mm-dd", "dd/mm/yyyy", "mm/dd/yyyy", "dd-mmm-yyyy",
      "yyyy/mm/dd", "persian-yyyy/mm/dd", "persian-yyyy-mm-dd",
      "persian-yy/mm/dd", "persian-yy-mm-dd", "persian-long",
    ] as const) &&
    isOneOf(candidate.timeFormat, ["12", "24"] as const) &&
    isOneOf(candidate.weekStart, ["saturday", "sunday", "monday"] as const) &&
    isOneOf(candidate.numberFormat, ["western", "arabic"] as const) &&
    isOneOf(candidate.theme, ["light", "dark", "system"] as const) &&
    Number.isInteger(candidate.pageSize) &&
    candidate.pageSize! >= 1 &&
    candidate.pageSize! <= 500 &&
    isOneOf(pms.timelineScale, ["day", "week", "month", "quarter", "year"] as const) &&
    typeof pms.showTodayLine === "boolean" &&
    typeof pms.showBaseline === "boolean" &&
    typeof pms.showCriticalPath === "boolean" &&
    typeof pms.showMilestones === "boolean" &&
    typeof pms.showFloat === "boolean" &&
    typeof pms.defaultWbsExpanded === "boolean"
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