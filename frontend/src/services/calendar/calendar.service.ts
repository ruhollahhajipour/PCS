import type {
  CalendarType,
  DateFormat,
  Language,
  Settings,
  TimeFormat,
} from "../../types/settings";

/**
 * PCS Calendar Engine
 *
 * Internal date representation:
 * - Gregorian / ISO
 * - Suitable for API and database communication
 *
 * Display:
 * - Gregorian
 * - Persian / Jalali
 *
 * The engine never changes the underlying stored date.
 */

export interface CalendarDateParts {
  year: number;
  month: number;
  day: number;
}

export interface CalendarFormatOptions {
  calendar?: CalendarType;
  dateFormat?: DateFormat;
  language?: Language;
  timeFormat?: TimeFormat;
}

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const PERSIAN_MONTHS_LATIN = [
  "Farvardin",
  "Ordibehesht",
  "Khordad",
  "Tir",
  "Mordad",
  "Shahrivar",
  "Mehr",
  "Aban",
  "Azar",
  "Dey",
  "Bahman",
  "Esfand",
];

const GREGORIAN_MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}

function toPersianDigits(value: string | number): string {
  return String(value).replace(
    /\d/g,
    (digit) => PERSIAN_DIGITS[Number(digit)],
  );
}

function toArabicDigits(value: string | number): string {
  return String(value).replace(
    /\d/g,
    (digit) => ARABIC_DIGITS[Number(digit)],
  );
}

/**
 * Gregorian -> Persian/Jalali
 *
 * Based on the standard arithmetic Jalali conversion.
 */
function gregorianToPersian(
  gy: number,
  gm: number,
  gd: number,
): CalendarDateParts {
  const gDaysInMonth = [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  const gy2 = gm > 2 ? gy + 1 : gy;

  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400);

  for (let i = 0; i < gm - 1; i += 1) {
    days += gDaysInMonth[i];
  }

  if (
    gm > 2 &&
    (gy % 4 === 0 &&
      (gy % 100 !== 0 || gy % 400 === 0))
  ) {
    days += 1;
  }

  days += gd;

  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const jm =
    days < 186
      ? 1 + Math.floor(days / 31)
      : 7 + Math.floor((days - 186) / 30);

  const jd =
    1 +
    (days < 186
      ? days % 31
      : (days - 186) % 30);

  return {
    year: jy,
    month: jm,
    day: jd,
  };
}

/**
 * Persian/Jalali -> Gregorian
 */
function persianToGregorian(
  jy: number,
  jm: number,
  jd: number,
): CalendarDateParts {
  let year = jy + 1595;

  let days =
    -355668 +
    365 * year +
    Math.floor(year / 33) * 8 +
    Math.floor(((year % 33) + 3) / 4) +
    jd +
    (jm < 7
      ? (jm - 1) * 31
      : (jm - 7) * 30 + 186);

  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;

    if (days >= 365) {
      days += 1;
    }
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let gd = days + 1;

  const leap =
    gy % 4 === 0 &&
    (gy % 100 !== 0 || gy % 400 === 0);

  const monthDays = [
    31,
    leap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let gm = 0;

  while (gm < 12 && gd > monthDays[gm]) {
    gd -= monthDays[gm];
    gm += 1;
  }

  return {
    year: gy,
    month: gm + 1,
    day: gd,
  };
}

function parseDate(
  value: string | Date,
): Date | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return new Date(value.getTime());
  }

  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function getGregorianParts(
  value: string | Date,
): CalendarDateParts | null {
  const date = parseDate(value);

  if (!date) {
    return null;
  }

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function resolveCalendar(
  settings?: Settings,
  options?: CalendarFormatOptions,
): CalendarType {
  return (
    options?.calendar ??
    settings?.calendar ??
    "gregorian"
  );
}

function resolveDateFormat(
  settings?: Settings,
  options?: CalendarFormatOptions,
): DateFormat {
  return (
    options?.dateFormat ??
    settings?.dateFormat ??
    "dd/mm/yyyy"
  );
}

function resolveLanguage(
  settings?: Settings,
  options?: CalendarFormatOptions,
): Language {
  return (
    options?.language ??
    settings?.language ??
    "en"
  );
}

function formatGregorian(
  parts: CalendarDateParts,
  format: DateFormat,
): string {
  const yyyy = String(parts.year);
  const mm = pad(parts.month);
  const dd = pad(parts.day);
  const mmm =
    GREGORIAN_MONTHS_SHORT[parts.month - 1];

  switch (format) {
    case "yyyy-mm-dd":
      return `${yyyy}-${mm}-${dd}`;

    case "dd/mm/yyyy":
      return `${dd}/${mm}/${yyyy}`;

    case "mm/dd/yyyy":
      return `${mm}/${dd}/${yyyy}`;

    case "dd-mmm-yyyy":
      return `${dd}-${mmm}-${yyyy}`;

    case "yyyy/mm/dd":
      return `${yyyy}/${mm}/${dd}`;

    default:
      return `${dd}/${mm}/${yyyy}`;
  }
}

function formatPersian(
  parts: CalendarDateParts,
  format: DateFormat,
  language: Language,
): string {
  const yyyy = String(parts.year);
  const yy = yyyy.slice(-2);
  const mm = pad(parts.month);
  const dd = pad(parts.day);

  const monthName =
    language === "en"
      ? PERSIAN_MONTHS_LATIN[parts.month - 1]
      : PERSIAN_MONTHS[parts.month - 1];

  let result: string;

  switch (format) {
    case "persian-yyyy-mm-dd":
      result = `${yyyy}-${mm}-${dd}`;
      break;

    case "persian-yy/mm/dd":
      result = `${yy}/${mm}/${dd}`;
      break;

    case "persian-yy-mm-dd":
      result = `${yy}-${mm}-${dd}`;
      break;

    case "persian-long":
      result = `${dd} ${monthName} ${yyyy}`;
      break;

    case "persian-yyyy/mm/dd":
    default:
      result = `${yyyy}/${mm}/${dd}`;
      break;
  }

  if (language === "fa") {
    return toPersianDigits(result);
  }

  if (language === "ar") {
    return toArabicDigits(result);
  }

  return result;
}

class CalendarService {
  /**
   * Convert a Gregorian date to Jalali parts.
   */
  toPersian(
    value: string | Date,
  ): CalendarDateParts | null {
    const parts = getGregorianParts(value);

    if (!parts) {
      return null;
    }

    return gregorianToPersian(
      parts.year,
      parts.month,
      parts.day,
    );
  }

  /**
   * Convert Jalali parts to Gregorian parts.
   */
  toGregorian(
    year: number,
    month: number,
    day: number,
  ): CalendarDateParts {
    return persianToGregorian(
      year,
      month,
      day,
    );
  }

  /**
   * Format a date according to PCS Settings.
   */
  format(
    value: string | Date | undefined | null,
    settings?: Settings,
    options?: CalendarFormatOptions,
  ): string {
    if (!value) {
      return "";
    }

    const parts = getGregorianParts(value);

    if (!parts) {
      return "";
    }

    const calendar = resolveCalendar(
      settings,
      options,
    );

    const format = resolveDateFormat(
      settings,
      options,
    );

    const language = resolveLanguage(
      settings,
      options,
    );

    if (calendar === "persian") {
      const persian =
        gregorianToPersian(
          parts.year,
          parts.month,
          parts.day,
        );

      return formatPersian(
        persian,
        format,
        language,
      );
    }

    return formatGregorian(
      parts,
      format,
    );
  }

  /**
   * Format date and time according to PCS Settings.
   */
  formatDateTime(
    value: string | Date | undefined | null,
    settings?: Settings,
    options?: CalendarFormatOptions,
  ): string {
    if (!value) {
      return "";
    }

    const date = parseDate(value);

    if (!date) {
      return "";
    }

    const datePart = this.format(
      date,
      settings,
      options,
    );

    const timeFormat =
      options?.timeFormat ??
      settings?.timeFormat ??
      "24";

    let hours = date.getHours();
    const minutes = pad(date.getMinutes());

    if (timeFormat === "12") {
      const suffix =
        hours >= 12 ? "PM" : "AM";

      hours = hours % 12;

      if (hours === 0) {
        hours = 12;
      }

      return `${datePart} ${pad(hours)}:${minutes} ${suffix}`;
    }

    return `${datePart} ${pad(hours)}:${minutes}`;
  }

  /**
   * Return today's date as an ISO Gregorian date.
   * This is intentionally independent of display calendar.
   */
  today(): string {
    const now = new Date();

    return [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
    ].join("-");
  }

  /**
   * Convert a Gregorian ISO date to Jalali parts.
   */
  isoToPersian(
    isoDate: string,
  ): CalendarDateParts | null {
    return this.toPersian(isoDate);
  }

  /**
   * Create a Gregorian ISO date from Jalali parts.
   */
  persianToIso(
    year: number,
    month: number,
    day: number,
  ): string {
    const gregorian =
      this.toGregorian(
        year,
        month,
        day,
      );

    return [
      gregorian.year,
      pad(gregorian.month),
      pad(gregorian.day),
    ].join("-");
  }

  /**
   * Expose Persian month names for UI controls.
   */
  getPersianMonthNames(
    language: Language = "fa",
  ): string[] {
    return language === "en"
      ? [...PERSIAN_MONTHS_LATIN]
      : [...PERSIAN_MONTHS];
  }
}

export default new CalendarService();





