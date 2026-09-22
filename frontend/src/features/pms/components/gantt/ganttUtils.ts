import type { GanttRow } from "../../api/ganttApi";

import type {
    RowSchedule,
    ScheduleRange,
    TimelineScale,
    TimelineUnit
} from "./ganttTypes";

/* =========================================================
 * CONSTANTS
 * ========================================================= */

const DAY_MS = 86_400_000;
const MAX_TIMELINE_UNITS = 5000;


/* =========================================================
 * FORMATTING
 * ========================================================= */

export function formatProgress(
    value: number
): string {
    return Number.isFinite(value)
        ? `${Math.round(value)}%`
        : "0%";
}


export function formatNumericValue(
    value: unknown,
    decimals = 2
): string {
    const numeric = Number(value);

    return Number.isFinite(numeric)
        ? new Intl.NumberFormat("en-US", {
              maximumFractionDigits: decimals
          }).format(numeric)
        : "—";
}


export function formatWeightFactor(
    value: unknown
): string {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
        return "—";
    }

    return `${formatNumericValue(
        Math.abs(numeric) <= 1
            ? numeric * 100
            : numeric,
        1
    )}%`;
}


export function formatPercentageValue(
    value: unknown
): string {
    const numeric = Number(value);

    return Number.isFinite(numeric)
        ? `${Math.round(
              clamp(numeric, 0, 100)
          )}%`
        : "—";
}


/* =========================================================
 * NUMERIC HELPERS
 * ========================================================= */

export function clamp(
    value: number,
    min: number,
    max: number
): number {
    return Math.min(
        Math.max(value, min),
        max
    );
}


/* =========================================================
 * DATE PARSING / NORMALIZATION
 * ========================================================= */

/**
 * Creates a UTC Date from a calendar date.
 *
 * The important point here is that PMS/Gantt dates are
 * calendar dates, not moments in time.
 *
 * Example:
 *
 *     2026-09-07
 *
 * becomes:
 *
 *     2026-09-07T00:00:00.000Z
 *
 * and therefore remains September 7 regardless of the
 * browser's local timezone.
 */
function createUtcCalendarDate(
    year: number,
    month: number,
    day: number
): Date | null {
    if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day)
    ) {
        return null;
    }

    if (
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return null;
    }

    const result = new Date(
        Date.UTC(
            year,
            month - 1,
            day
        )
    );

    /*
     * Date.UTC silently normalizes invalid dates.
     *
     * For example:
     * 2026-02-31
     *
     * would otherwise become a date in March.
     *
     * We explicitly reject that behavior.
     */
    if (
        result.getUTCFullYear() !== year ||
        result.getUTCMonth() !== month - 1 ||
        result.getUTCDate() !== day
    ) {
        return null;
    }

    return result;
}


/**
 * Parses a date value and normalizes it to a UTC calendar day.
 *
 * Supported examples:
 *
 *     2026-09-07
 *     2026-09-07T00:00:00
 *     2026-09-07T00:00:00.000
 *     2026-09-07T00:00:00Z
 *     2026-09-07T04:00:00+04:00
 *
 * Important behavior:
 *
 * 1. Date-only values are treated as calendar dates.
 * 2. ISO datetime values WITHOUT timezone are also treated
 *    as calendar dates.
 * 3. Timestamp values WITH an explicit timezone are treated
 *    as real instants and converted to their UTC calendar day.
 *
 * This prevents the classic:
 *
 *     2026-09-07 → 2026-09-06
 *
 * timezone shift.
 */
export function parseDate(
    value?: string | null
): Date | null {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    /* -----------------------------------------------------
     * 1. Pure ISO calendar date
     * ----------------------------------------------------- */

    const dateOnlyMatch =
        /^(\d{4})-(\d{2})-(\d{2})$/.exec(
            trimmed
        );

    if (dateOnlyMatch) {
        return createUtcCalendarDate(
            Number(dateOnlyMatch[1]),
            Number(dateOnlyMatch[2]),
            Number(dateOnlyMatch[3])
        );
    }


    /* -----------------------------------------------------
     * 2. ISO datetime WITHOUT timezone
     *
     * Examples:
     *
     * 2026-09-07T00:00:00
     * 2026-09-07T00:00:00.000
     * 2026-09-07 00:00:00
     *
     * These are interpreted as calendar values rather than
     * browser-local timestamps.
     * ----------------------------------------------------- */

    const localIsoDateTimeMatch =
        /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?$/.exec(
            trimmed
        );

    if (localIsoDateTimeMatch) {
        return createUtcCalendarDate(
            Number(localIsoDateTimeMatch[1]),
            Number(localIsoDateTimeMatch[2]),
            Number(localIsoDateTimeMatch[3])
        );
    }


    /* -----------------------------------------------------
     * 3. ISO datetime WITH explicit timezone
     *
     * Examples:
     *
     * 2026-09-07T00:00:00Z
     * 2026-09-07T04:00:00+04:00
     * ----------------------------------------------------- */

    const timezoneDate =
        new Date(trimmed);

    if (
        Number.isNaN(
            timezoneDate.getTime()
        )
    ) {
        return null;
    }

    /*
     * An explicit timezone means the value represents an
     * actual instant. In that case we preserve the UTC
     * calendar day represented by that instant.
     */
    return new Date(
        Date.UTC(
            timezoneDate.getUTCFullYear(),
            timezoneDate.getUTCMonth(),
            timezoneDate.getUTCDate()
        )
    );
}


/**
 * Normalizes any Date object to its UTC calendar day.
 */
export function normalizeUtcDay(
    date: Date
): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        )
    );
}


/**
 * Adds calendar days without allowing local timezone
 * calculations to interfere.
 */
export function addDaysUtc(
    date: Date,
    days: number
): Date {
    const result =
        normalizeUtcDay(date);

    result.setUTCDate(
        result.getUTCDate() + days
    );

    return result;
}


/* =========================================================
 * CALENDAR / TIMELINE STARTS
 * ========================================================= */

export function startOfWeekUtc(
    date: Date
): Date {
    const result =
        normalizeUtcDay(date);

    const day =
        result.getUTCDay();

    /*
     * Monday = first day of week.
     * Sunday is moved back six days.
     */
    result.setUTCDate(
        result.getUTCDate() -
            (
                day === 0
                    ? 6
                    : day - 1
            )
    );

    return result;
}


export function startOfMonthUtc(
    date: Date
): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            1
        )
    );
}


export function startOfQuarterUtc(
    date: Date
): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            Math.floor(
                date.getUTCMonth() / 3
            ) * 3,
            1
        )
    );
}


export function startOfYearUtc(
    date: Date
): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            0,
            1
        )
    );
}


export function startForScale(
    date: Date,
    scale: TimelineScale
): Date {
    switch (scale) {
        case "day":
            return normalizeUtcDay(
                date
            );

        case "week":
            return startOfWeekUtc(
                date
            );

        case "month":
            return startOfMonthUtc(
                date
            );

        case "quarter":
            return startOfQuarterUtc(
                date
            );

        case "year":
            return startOfYearUtc(
                date
            );

        default:
            return normalizeUtcDay(
                date
            );
    }
}


export function nextTimelineUnit(
    date: Date,
    scale: TimelineScale
): Date {
    switch (scale) {
        case "day":
            return addDaysUtc(
                date,
                1
            );

        case "week":
            return addDaysUtc(
                date,
                7
            );

        case "month":
            return new Date(
                Date.UTC(
                    date.getUTCFullYear(),
                    date.getUTCMonth() + 1,
                    1
                )
            );

        case "quarter":
            return new Date(
                Date.UTC(
                    date.getUTCFullYear(),
                    date.getUTCMonth() + 3,
                    1
                )
            );

        case "year":
            return new Date(
                Date.UTC(
                    date.getUTCFullYear() + 1,
                    0,
                    1
                )
            );

        default:
            return addDaysUtc(
                date,
                1
            );
    }
}


/* =========================================================
 * DATE DIFFERENCES
 * ========================================================= */

export function dateDiffDays(
    start: Date,
    end: Date
): number {
    const startDay =
        normalizeUtcDay(start);

    const endDay =
        normalizeUtcDay(end);

    return Math.max(
        0,
        Math.round(
            (
                endDay.getTime() -
                startDay.getTime()
            ) / DAY_MS
        )
    );
}


/* =========================================================
 * DATE DISPLAY
 * ========================================================= */

/**
 * All display functions explicitly use UTC.
 *
 * This is intentional because the Date object represents
 * a PMS calendar day normalized to UTC midnight.
 */
export function formatDate(
    date: Date | null
): string {
    return date
        ? new Intl.DateTimeFormat(
              "en-GB",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC"
              }
          ).format(date)
        : "—";
}


export function formatShortDate(
    date: Date
): string {
    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            timeZone: "UTC"
        }
    ).format(date);
}


export function formatMonthYear(
    date: Date
): string {
    return new Intl.DateTimeFormat(
        "en-GB",
        {
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        }
    ).format(date);
}


export function formatYear(
    date: Date
): string {
    return String(
        date.getUTCFullYear()
    );
}


/**
 * Formats a Date as a stable ISO calendar date.
 *
 * Example:
 *
 *     2026-09-07
 *
 * This helper is useful whenever a date needs to be written
 * back to API/UI state.
 */
export function formatIsoDate(
    date: Date | null
): string {
    if (!date) {
        return "";
    }

    const normalized =
        normalizeUtcDay(date);

    const year =
        normalized
            .getUTCFullYear()
            .toString()
            .padStart(4, "0");

    const month =
        String(
            normalized.getUTCMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            normalized.getUTCDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================================
 * ISO WEEK
 * ========================================================= */

export function getIsoWeek(
    date: Date
): number {
    const temp =
        normalizeUtcDay(date);

    const day =
        temp.getUTCDay() || 7;

    temp.setUTCDate(
        temp.getUTCDate() +
            4 -
            day
    );

    const yearStart =
        new Date(
            Date.UTC(
                temp.getUTCFullYear(),
                0,
                1
            )
        );

    return Math.ceil(
        (
            (
                temp.getTime() -
                yearStart.getTime()
            ) /
                DAY_MS +
            1
        ) / 7
    );
}


/* =========================================================
 * TIMELINE UNITS
 * ========================================================= */

/**
 * Builds timeline header units.
 *
 * Supports both:
 *
 * getTimelineUnits(range, scale)
 *
 * and the legacy:
 *
 * getTimelineUnits(start, end, scale)
 *
 * This keeps the utility backward-compatible while
 * GanttChart is being refactored.
 */
export function getTimelineUnits(
    range: ScheduleRange,
    scale: TimelineScale
): TimelineUnit[];

export function getTimelineUnits(
    rangeStart: Date,
    rangeEnd: Date,
    scale: TimelineScale
): TimelineUnit[];

export function getTimelineUnits(
    first: ScheduleRange | Date,
    second: TimelineScale | Date,
    third?: TimelineScale
): TimelineUnit[] {
    const rangeStart =
        first instanceof Date
            ? first
            : first.start;

    const rangeEnd =
        first instanceof Date
            ? (second as Date)
            : first.end;

    const scale =
        first instanceof Date
            ? third!
            : second as TimelineScale;

    const units: TimelineUnit[] =
        [];

    let cursor =
        startForScale(
            rangeStart,
            scale
        );

    let guard = 0;

    while (
        cursor.getTime() <=
            rangeEnd.getTime() &&
        guard++ <
            MAX_TIMELINE_UNITS
    ) {
        const end =
            nextTimelineUnit(
                cursor,
                scale
            );

        let label = "";

        let secondaryLabel:
            string | undefined;

        switch (scale) {
            case "day":
                label =
                    formatShortDate(
                        cursor
                    );

                secondaryLabel =
                    formatYear(
                        cursor
                    );

                break;

            case "week":
                label =
                    `W${getIsoWeek(
                        cursor
                    )}`;

                secondaryLabel =
                    formatShortDate(
                        cursor
                    );

                break;

            case "month":
                label =
                    formatMonthYear(
                        cursor
                    );

                break;

            case "quarter":
                label =
                    `Q${
                        Math.floor(
                            cursor.getUTCMonth() /
                                3
                        ) + 1
                    }`;

                secondaryLabel =
                    formatYear(
                        cursor
                    );

                break;

            case "year":
                label =
                    formatYear(
                        cursor
                    );

                break;
        }

        units.push({
            start: cursor,
            end,
            label,
            secondaryLabel
        });

        cursor = end;
    }

    return units;
}


/* =========================================================
 * ROW STATUS
 * ========================================================= */

export function getRowStatus(
    row: GanttRow
): string {
    if (row.type === "wbs") {
        return "WBS";
    }

    if (row.isMilestone) {
        return "Milestone";
    }

    if (row.isCritical) {
        return "Critical";
    }

    if (row.progress >= 100) {
        return "Complete";
    }

    if (row.progress > 0) {
        return "In Progress";
    }

    return "Not Started";
}


/* =========================================================
 * TREE HELPERS
 * ========================================================= */

export function flattenVisibleRows(
    rows: GanttRow[],
    expandedIds: Set<string>
): GanttRow[] {
    const result: GanttRow[] = [];

    const visit = (
        items: GanttRow[]
    ): void => {
        for (const row of items) {
            result.push(row);

            if (
                row.children.length > 0 &&
                expandedIds.has(row.id)
            ) {
                visit(
                    row.children
                );
            }
        }
    };

    visit(rows);

    return result;
}


export function collectWbsIds(
    rows: GanttRow[]
): string[] {
    const result: string[] = [];

    const visit = (
        items: GanttRow[]
    ): void => {
        for (const row of items) {
            if (
                row.type === "wbs"
            ) {
                result.push(
                    row.id
                );
            }

            if (
                row.children.length > 0
            ) {
                visit(
                    row.children
                );
            }
        }
    };

    visit(rows);

    return result;
}


export interface GanttRowCounts {
    wbs: number;
    activities: number;
    critical: number;
    milestones: number;
}


export function countRows(
    rows: GanttRow[]
): GanttRowCounts {
    let wbs = 0;
    let activities = 0;
    let critical = 0;
    let milestones = 0;

    const visit = (
        items: GanttRow[]
    ): void => {
        for (const row of items) {
            if (
                row.type === "wbs"
            ) {
                wbs++;
            } else {
                activities++;

                if (row.isCritical) {
                    critical++;
                }

                if (
                    row.isMilestone
                ) {
                    milestones++;
                }
            }

            if (
                row.children.length > 0
            ) {
                visit(
                    row.children
                );
            }
        }
    };

    visit(rows);

    return {
        wbs,
        activities,
        critical,
        milestones
    };
}


/* =========================================================
 * ACTIVITY SCHEDULE
 * ========================================================= */

export function getActivitySchedule(
    row: GanttRow
): RowSchedule {
    const plannedStart =
        parseDate(
            row.plannedStart
        );

    const plannedFinish =
        parseDate(
            row.plannedFinish
        );

    const actualStart =
        parseDate(
            row.actualStart
        );

    const actualFinish =
        parseDate(
            row.actualFinish
        );

    /*
     * Planned schedule has priority.
     */
    if (
        plannedStart &&
        plannedFinish
    ) {
        return {
            start: plannedStart,
            finish: plannedFinish,
            actualStart,
            actualFinish,
            hasRealDates: true
        };
    }

    /*
     * If planned dates are unavailable,
     * fall back to actual dates.
     */
    if (
        actualStart &&
        actualFinish
    ) {
        return {
            start: actualStart,
            finish: actualFinish,
            actualStart,
            actualFinish,
            hasRealDates: true
        };
    }

    return {
        start: null,
        finish: null,
        actualStart,
        actualFinish,
        hasRealDates: false
    };
}


/* =========================================================
 * WBS SCHEDULE
 * ========================================================= */

export function getRowSchedule(
    row: GanttRow
): RowSchedule {
    if (row.type !== "wbs") {
        return getActivitySchedule(
            row
        );
    }

    const schedules:
        RowSchedule[] = [];

    const visit = (
        items: GanttRow[]
    ): void => {
        for (const child of items) {
            const schedule =
                getRowSchedule(
                    child
                );

            if (
                schedule.start &&
                schedule.finish
            ) {
                schedules.push(
                    schedule
                );
            }

            if (
                child.children.length >
                0
            ) {
                visit(
                    child.children
                );
            }
        }
    };

    visit(
        row.children
    );

    if (
        schedules.length === 0
    ) {
        return {
            start: null,
            finish: null,
            actualStart: null,
            actualFinish: null,
            hasRealDates: false
        };
    }

    const starts =
        schedules
            .map(
                schedule =>
                    schedule.start!
            )
            .sort(
                (a, b) =>
                    a.getTime() -
                    b.getTime()
            );

    const finishes =
        schedules
            .map(
                schedule =>
                    schedule.finish!
            )
            .sort(
                (a, b) =>
                    a.getTime() -
                    b.getTime()
            );

    const actualStarts =
        schedules
            .map(
                schedule =>
                    schedule.actualStart
            )
            .filter(
                (
                    value
                ): value is Date =>
                    Boolean(value)
            )
            .sort(
                (a, b) =>
                    a.getTime() -
                    b.getTime()
            );

    const actualFinishes =
        schedules
            .map(
                schedule =>
                    schedule.actualFinish
            )
            .filter(
                (
                    value
                ): value is Date =>
                    Boolean(value)
            )
            .sort(
                (a, b) =>
                    a.getTime() -
                    b.getTime()
            );

    return {
        start:
            starts[0],

        finish:
            finishes[
                finishes.length - 1
            ],

        actualStart:
            actualStarts[0] ??
            null,

        actualFinish:
            actualFinishes[
                actualFinishes.length - 1
            ] ??
            null,

        hasRealDates: true
    };
}


/* =========================================================
 * PROJECT SCHEDULE RANGE
 * ========================================================= */

export function getProjectScheduleRange(
    rows: GanttRow[],
    projectDuration = 1
): ScheduleRange {
    const starts: Date[] = [];
    const finishes: Date[] = [];

    const visit = (
        items: GanttRow[]
    ): void => {
        for (const row of items) {
            if (
                row.type !== "wbs"
            ) {
                const plannedStart =
                    parseDate(
                        row.plannedStart
                    );

                const plannedFinish =
                    parseDate(
                        row.plannedFinish
                    );

                const actualStart =
                    parseDate(
                        row.actualStart
                    );

                const actualFinish =
                    parseDate(
                        row.actualFinish
                    );

                if (
                    plannedStart
                ) {
                    starts.push(
                        plannedStart
                    );
                }

                if (
                    plannedFinish
                ) {
                    finishes.push(
                        plannedFinish
                    );
                }

                if (
                    actualStart
                ) {
                    starts.push(
                        actualStart
                    );
                }

                if (
                    actualFinish
                ) {
                    finishes.push(
                        actualFinish
                    );
                }
            }

            if (
                row.children.length >
                0
            ) {
                visit(
                    row.children
                );
            }
        }
    };

    visit(rows);

    /*
     * Real project dates available.
     */
    if (
        starts.length > 0 &&
        finishes.length > 0
    ) {
        const start =
            new Date(
                Math.min(
                    ...starts.map(
                        date =>
                            date.getTime()
                    )
                )
            );

        let end =
            new Date(
                Math.max(
                    ...finishes.map(
                        date =>
                            date.getTime()
                    )
                )
            );

        /*
         * Keep milestone/single-day schedules
         * visually meaningful.
         */
        if (
            start.getTime() ===
            end.getTime()
        ) {
            end =
                addDaysUtc(
                    end,
                    1
                );
        }

        return {
            start:
                normalizeUtcDay(
                    start
                ),

            end:
                normalizeUtcDay(
                    end
                ),

            hasRealDates: true
        };
    }

    /*
     * No usable schedule dates.
     *
     * Use today's UTC calendar day rather than the
     * browser's local Date interpretation.
     */
    const now =
        new Date();

    const start =
        normalizeUtcDay(
            now
        );

    const days =
        Math.max(
            1,
            Number(
                projectDuration
            ) || 1
        );

    return {
        start,

        end:
            addDaysUtc(
                start,
                days
            ),

        hasRealDates: false
    };
}