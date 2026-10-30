// Jalali (Solar Hijri) <-> Gregorian conversion. No external dependency.
// Algorithm after jalaali-js (Behrooz Kamali / Hadi Sharifi), MIT.

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
  2192, 2262, 2324, 2394, 2456, 3178,
];

const div = (a: number, b: number) => Math.trunc(a / b);
const mod = (a: number, b: number) => a - Math.trunc(a / b) * b;

function jalCal(jy: number) {
  const bl = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;

  if (jy < jp || jy >= BREAKS[bl - 1]) {
    throw new Error(`Invalid Jalali year ${jy}`);
  }

  for (let i = 1; i < bl; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Convert Persian / Arabic-Indic digits (and the Arabic decimal/thousand separators) to Latin. */
export function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/٫/g, ".")
    .replace(/٬/g, ",");
}

export function gregorianToJalali(gy: number, gm: number, gd: number): string {
  const { jy, jm, jd } = d2j(g2d(gy, gm, gd));
  return `${pad(jy, 4)}/${pad(jm)}/${pad(jd)}`;
}

export function dateToJalali(date: Date): string {
  return gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
}

export function todayJalali(): string {
  return dateToJalali(new Date());
}

export function jalaliToGregorian(jalali: string): Date | null {
  const p = parseJalali(jalali);
  if (!p) return null;
  const { gy, gm, gd } = d2g(j2d(p.jy, p.jm, p.jd));
  return new Date(gy, gm - 1, gd);
}

export function parseJalali(
  value: string,
): { jy: number; jm: number; jd: number } | null {
  const m = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(toLatinDigits(value.trim()));
  if (!m) return null;

  const jy = Number(m[1]);
  const jm = Number(m[2]);
  const jd = Number(m[3]);
  if (jy < 1200 || jy > 1600 || jm < 1 || jm > 12 || jd < 1) return null;

  // Round-trip through the day number: rejects e.g. 1405/12/30 (non-leap).
  const back = d2j(j2d(jy, jm, jd));
  if (back.jy !== jy || back.jm !== jm || back.jd !== jd) return null;

  return { jy, jm, jd };
}

/** Normalizes user input ("۱۴۰۵/۸/۹") to "1405/08/09", or null when invalid. */
export function normalizeJalali(value: string): string | null {
  const p = parseJalali(value);
  return p ? `${pad(p.jy, 4)}/${pad(p.jm)}/${pad(p.jd)}` : null;
}

export function isValidJalali(value: string): boolean {
  return parseJalali(value) !== null;
}

/** Display with Persian digits, e.g. ۱۴۰۵/۰۸/۰۸ */
export function showJalali(value: string): string {
  return value.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Current Jalali fiscal year, e.g. 1405 */
export function currentJalaliYear(): number {
  return Number(todayJalali().slice(0, 4));
}
