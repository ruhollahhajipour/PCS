export type Language = "en" | "fa" | "ar";

export type Direction = "auto" | "ltr" | "rtl";

export type CalendarType = "gregorian" | "persian";

export type DateFormat =
  | "yyyy-mm-dd"
  | "dd/mm/yyyy"
  | "mm/dd/yyyy"
  | "dd-mmm-yyyy"
  | "yyyy/mm/dd"
  | "persian-yyyy/mm/dd"
  | "persian-yyyy-mm-dd"
  | "persian-yy/mm/dd"
  | "persian-yy-mm-dd"
  | "persian-long";

export type TimeFormat = "24" | "12";

export type WeekStart = "saturday" | "sunday" | "monday";

export type NumberFormat = "western" | "arabic";

export type TimelineScale =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

export interface PmsViewSettings {
  timelineScale: TimelineScale;

  showTodayLine: boolean;
  showBaseline: boolean;
  showCriticalPath: boolean;
  showMilestones: boolean;
  showFloat: boolean;

  defaultWbsExpanded: boolean;
}

export interface Settings {
  companyName: string;

  currency: string;

  language: Language;

  direction: Direction;

  calendar: CalendarType;

  dateFormat: DateFormat;

  timeFormat: TimeFormat;

  weekStart: WeekStart;

  numberFormat: NumberFormat;

  theme: "light" | "dark" | "system";

  pageSize: number;

  pms: PmsViewSettings;
}

export interface ThemeSettings {
  mode: "light" | "dark" | "system";

  primaryColor: string;

  secondaryColor: string;
}

export interface LocalizationSettings {
  language: Language;

  direction: Direction;

  calendar: CalendarType;

  dateFormat: DateFormat;

  timeFormat: TimeFormat;

  weekStart: WeekStart;

  numberFormat: NumberFormat;
}