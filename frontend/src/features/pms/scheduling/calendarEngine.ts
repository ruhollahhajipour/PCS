import type {
    CalendarDayDefinition,
    CalendarException,
    CalendarInterval,
    ScheduleCalendar
} from "./scheduleTypes";

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MAX_CALENDAR_SCAN_DAYS = 10000;

export type CalendarPresetId =
    | "standard-5-day"
    | "six-day-saturday-thursday"
    | "seven-day"
    | "six-day-sunday-friday"
    | "24x7";

export interface CalendarPresetOptions {
    id?: string;
    name?: string;
    hoursPerDay?: number;
    startHour?: number;
    endHour?: number;
}

/* -------------------------------------------------------------------------- */
/* Basic helpers                                                              */
/* -------------------------------------------------------------------------- */

function cloneIntervals(
    intervals: CalendarInterval[]
): CalendarInterval[] {
    return intervals.map(interval => ({
        ...interval
    }));
}

function cloneDayDefinition(
    definition: CalendarDayDefinition
): CalendarDayDefinition {
    return {
        working: definition.working,
        intervals: definition.intervals
            ? cloneIntervals(definition.intervals)
            : undefined
    };
}

function clampHour(
    value: number
): number {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(24, value)
    );
}

function normalizeHoursPerDay(
    value: number | undefined,
    fallback: number
): number {
    const hours = Number(value);

    if (!Number.isFinite(hours)) {
        return fallback;
    }

    return Math.max(
        0,
        Math.min(24, hours)
    );
}

/* -------------------------------------------------------------------------- */
/* Date helpers                                                               */
/* -------------------------------------------------------------------------- */

export function toDate(
    value:
        | Date
        | string
        | null
        | undefined
): Date | null {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isFinite(
            value.getTime()
        )
            ? new Date(value.getTime())
            : null;
    }

    const text = String(value).trim();

    if (!text) {
        return null;
    }

    /*
     * Date-only values are intentionally interpreted
     * as local calendar dates rather than UTC dates.
     */
    const match = text.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (match) {
        const [, year, month, day] = match;

        const result = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            0,
            0,
            0,
            0
        );

        return Number.isFinite(
            result.getTime()
        )
            ? result
            : null;
    }

    const result = new Date(text);

    return Number.isFinite(
        result.getTime()
    )
        ? result
        : null;
}

export function startOfDay(
    date: Date
): Date {
    const result = new Date(
        date.getTime()
    );

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}

export function endOfDay(
    date: Date
): Date {
    const result = new Date(
        date.getTime()
    );

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;
}

export function dateKey(
    date: Date
): string {
    const year =
        date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function setHour(
    date: Date,
    hour: number
): Date {
    const result = new Date(
        date.getTime()
    );

    const safeHour = clampHour(hour);

    const wholeHour =
        Math.floor(safeHour);

    const minutes = Math.round(
        (safeHour - wholeHour) * 60
    );

    result.setHours(
        wholeHour,
        minutes,
        0,
        0
    );

    return result;
}

/* -------------------------------------------------------------------------- */
/* Calendar interval helpers                                                  */
/* -------------------------------------------------------------------------- */

export function normalizeIntervals(
    intervals:
        | CalendarInterval[]
        | undefined,
    hoursPerDay: number
): CalendarInterval[] {
    const source =
        intervals?.length
            ? intervals
            : [
                  {
                      startHour: 0,
                      endHour:
                          hoursPerDay
                  }
              ];

    const normalized = source
        .map(interval => ({
            startHour: clampHour(
                interval.startHour
            ),
            endHour: clampHour(
                interval.endHour
            )
        }))
        .filter(
            interval =>
                interval.endHour >
                interval.startHour
        )
        .sort(
            (a, b) =>
                a.startHour -
                b.startHour
        );

    const merged: CalendarInterval[] = [];

    for (const interval of normalized) {
        const last =
            merged[
                merged.length - 1
            ];

        if (
            !last ||
            interval.startHour >
                last.endHour
        ) {
            merged.push({
                ...interval
            });

            continue;
        }

        last.endHour = Math.max(
            last.endHour,
            interval.endHour
        );
    }

    return merged;
}

function intervalStartEnd(
    date: Date,
    interval: CalendarInterval
): {
    start: Date;
    end: Date;
} {
    const dayStart =
        startOfDay(date);

    return {
        start: setHour(
            dayStart,
            interval.startHour
        ),
        end: setHour(
            dayStart,
            interval.endHour
        )
    };
}

function intervalHours(
    interval: CalendarInterval
): number {
    return Math.max(
        0,
        interval.endHour -
            interval.startHour
    );
}

function totalIntervalHours(
    intervals: CalendarInterval[]
): number {
    return intervals.reduce(
        (sum, interval) =>
            sum + intervalHours(interval),
        0
    );
}

/* -------------------------------------------------------------------------- */
/* Calendar creation                                                          */
/* -------------------------------------------------------------------------- */

function createWeek(
    workingDays: number[],
    intervals: CalendarInterval[]
): Record<
    number,
    CalendarDayDefinition
> {
    const working =
        new Set(workingDays);

    const week: Record<
        number,
        CalendarDayDefinition
    > = {};

    for (
        let day = 0;
        day <= 6;
        day += 1
    ) {
        week[day] =
            working.has(day)
                ? {
                      working: true,
                      intervals:
                          cloneIntervals(
                              intervals
                          )
                  }
                : {
                      working: false,
                      intervals: []
                  };
    }

    return week;
}

function createPresetCalendar(
    preset: CalendarPresetId,
    options: CalendarPresetOptions = {}
): ScheduleCalendar {
    const startHour = clampHour(
        options.startHour ?? 8
    );

    const requestedHours =
        normalizeHoursPerDay(
            options.hoursPerDay,
            8
        );

    const defaultEndHour =
        startHour +
        requestedHours;

    const endHour = clampHour(
        options.endHour ??
            defaultEndHour
    );

    const effectiveHours =
        Math.max(
            0,
            endHour - startHour
        );

    const interval = {
        startHour,
        endHour
    };

    switch (preset) {
        case "standard-5-day":
            return {
                id:
                    options.id ??
                    "standard",

                name:
                    options.name ??
                    "Standard 5-Day",

                hoursPerDay:
                    normalizeHoursPerDay(
                        options.hoursPerDay,
                        effectiveHours ||
                            8
                    ),

                defaultIntervals: [
                    interval
                ],

                week:
                    createWeek(
                        [
                            1,
                            2,
                            3,
                            4,
                            5
                        ],
                        [interval]
                    ),

                exceptions: []
            };

        case "six-day-saturday-thursday":
            return {
                id:
                    options.id ??
                    "six-day",

                name:
                    options.name ??
                    "Six-Day (Sat-Thu)",

                hoursPerDay:
                    normalizeHoursPerDay(
                        options.hoursPerDay,
                        effectiveHours ||
                            8
                    ),

                defaultIntervals: [
                    interval
                ],

                week:
                    createWeek(
                        [
                            0,
                            1,
                            2,
                            3,
                            4,
                            6
                        ],
                        [interval]
                    ),

                exceptions: []
            };

        case "six-day-sunday-friday":
            return {
                id:
                    options.id ??
                    "six-day-sun-fri",

                name:
                    options.name ??
                    "Six-Day (Sun-Fri)",

                hoursPerDay:
                    normalizeHoursPerDay(
                        options.hoursPerDay,
                        effectiveHours ||
                            8
                    ),

                defaultIntervals: [
                    interval
                ],

                week:
                    createWeek(
                        [
                            0,
                            1,
                            2,
                            3,
                            4,
                            5
                        ],
                        [interval]
                    ),

                exceptions: []
            };

        case "seven-day":
            return {
                id:
                    options.id ??
                    "seven-day",

                name:
                    options.name ??
                    "Seven-Day",

                hoursPerDay:
                    normalizeHoursPerDay(
                        options.hoursPerDay,
                        effectiveHours ||
                            8
                    ),

                defaultIntervals: [
                    interval
                ],

                week:
                    createWeek(
                        [
                            0,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ],
                        [interval]
                    ),

                exceptions: []
            };

        case "24x7":
            return {
                id:
                    options.id ??
                    "24x7",

                name:
                    options.name ??
                    "24x7",

                hoursPerDay: 24,

                defaultIntervals: [
                    {
                        startHour: 0,
                        endHour: 24
                    }
                ],

                week:
                    createWeek(
                        [
                            0,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ],
                        [
                            {
                                startHour: 0,
                                endHour: 24
                            }
                        ]
                    ),

                exceptions: []
            };

        default:
            return createPresetCalendar(
                "standard-5-day",
                options
            );
    }
}

export function getDefaultCalendar():
    ScheduleCalendar {
    return createPresetCalendar(
        "standard-5-day",
        {
            id: "standard",
            name: "Standard 5-Day"
        }
    );
}

export function getStandard5DayCalendar(
    options: CalendarPresetOptions = {}
): ScheduleCalendar {
    return createPresetCalendar(
        "standard-5-day",
        options
    );
}

export function getSixDaySaturdayThursdayCalendar(
    options: CalendarPresetOptions = {}
): ScheduleCalendar {
    return createPresetCalendar(
        "six-day-saturday-thursday",
        options
    );
}

export function getSixDaySundayFridayCalendar(
    options: CalendarPresetOptions = {}
): ScheduleCalendar {
    return createPresetCalendar(
        "six-day-sunday-friday",
        options
    );
}

export function getSevenDayCalendar(
    options: CalendarPresetOptions = {}
): ScheduleCalendar {
    return createPresetCalendar(
        "seven-day",
        options
    );
}

export function get24x7Calendar(
    options: CalendarPresetOptions = {}
): ScheduleCalendar {
    return createPresetCalendar(
        "24x7",
        options
    );
}

export function createCustomCalendar(
    calendar: ScheduleCalendar
): ScheduleCalendar {
    const hoursPerDay =
        normalizeHoursPerDay(
            calendar.hoursPerDay,
            8
        );

    return {
        ...calendar,

        hoursPerDay,

        defaultIntervals:
            normalizeIntervals(
                calendar.defaultIntervals,
                hoursPerDay
            ),

        week:
            Object.fromEntries(
                Array.from(
                    {
                        length: 7
                    },
                    (_, day) => {
                        const definition =
                            calendar.week?.[
                                day
                            ] ?? {
                                working: false,
                                intervals: []
                            };

                        return [
                            day,
                            cloneDayDefinition(
                                definition
                            )
                        ];
                    }
                )
            ),

        exceptions: (
            calendar.exceptions ??
            []
        ).map(exception => ({
            ...exception,

            date: dateKey(
                toDate(
                    exception.date
                ) ?? new Date(0)
            ),

            intervals:
                exception.intervals
                    ? normalizeIntervals(
                          exception.intervals,
                          hoursPerDay
                      )
                    : undefined
        }))
    };
}

export function createCalendarRegistry(
    calendars:
        ScheduleCalendar[] = []
): Record<
    string,
    ScheduleCalendar
> {
    const standard =
        getDefaultCalendar();

    const registry: Record<
        string,
        ScheduleCalendar
    > = {
        [standard.id]:
            standard,

        "standard-5-day":
            getStandard5DayCalendar(),

        "six-day":
            getSixDaySaturdayThursdayCalendar(),

        "six-day-sun-fri":
            getSixDaySundayFridayCalendar(),

        "seven-day":
            getSevenDayCalendar(),

        "24x7":
            get24x7Calendar()
    };

    for (const calendar of calendars) {
        if (!calendar?.id) {
            continue;
        }

        registry[calendar.id] =
            createCustomCalendar(
                calendar
            );
    }

    return registry;
}

/* -------------------------------------------------------------------------- */
/* Calendar day                                                               */
/* -------------------------------------------------------------------------- */

export function getCalendarDay(
    calendar: ScheduleCalendar,
    date: Date
): CalendarDayDefinition {
    const key =
        dateKey(date);

    const exception = (
        calendar.exceptions ??
        []
    ).find(
        item =>
            item.date === key
    );

    if (exception) {
        return {
            working:
                exception.working ??
                true,

            intervals:
                exception.intervals
        };
    }

    return (
        calendar.week[
            date.getDay()
        ] ?? {
            working: false,
            intervals: []
        }
    );
}

export function getWorkingIntervals(
    calendar: ScheduleCalendar,
    date: Date
): CalendarInterval[] {
    const definition =
        getCalendarDay(
            calendar,
            date
        );

    if (!definition.working) {
        return [];
    }

    return normalizeIntervals(
        definition.intervals ??
            calendar.defaultIntervals,
        calendar.hoursPerDay
    );
}

export function isWorkingDay(
    calendar: ScheduleCalendar,
    date: Date
): boolean {
    return (
        getWorkingIntervals(
            calendar,
            date
        ).length > 0
    );
}

export function getWorkingHoursPerDay(
    calendar: ScheduleCalendar,
    date: Date
): number {
    return totalIntervalHours(
        getWorkingIntervals(
            calendar,
            date
        )
    );
}

/* -------------------------------------------------------------------------- */
/* Working-day navigation                                                     */
/* -------------------------------------------------------------------------- */

export function nextWorkingDay(
    calendar: ScheduleCalendar,
    date: Date,
    includeCurrent = false
): Date {
    const result =
        startOfDay(date);

    if (
        includeCurrent &&
        isWorkingDay(
            calendar,
            result
        )
    ) {
        return result;
    }

    for (
        let i = 0;
        i <
        MAX_CALENDAR_SCAN_DAYS;
        i += 1
    ) {
        result.setDate(
            result.getDate() + 1
        );

        if (
            isWorkingDay(
                calendar,
                result
            )
        ) {
            return result;
        }
    }

    return result;
}

export function previousWorkingDay(
    calendar: ScheduleCalendar,
    date: Date,
    includeCurrent = false
): Date {
    const result =
        startOfDay(date);

    if (
        includeCurrent &&
        isWorkingDay(
            calendar,
            result
        )
    ) {
        return result;
    }

    for (
        let i = 0;
        i <
        MAX_CALENDAR_SCAN_DAYS;
        i += 1
    ) {
        result.setDate(
            result.getDate() - 1
        );

        if (
            isWorkingDay(
                calendar,
                result
            )
        ) {
            return result;
        }
    }

    return result;
}

/* -------------------------------------------------------------------------- */
/* Working-time normalization                                                 */
/* -------------------------------------------------------------------------- */

export function startOfWorkingTime(
    calendar: ScheduleCalendar,
    date: Date,
    includeCurrent = true
): Date {
    let cursor =
        new Date(
            date.getTime()
        );

    for (
        let i = 0;
        i <
        MAX_CALENDAR_SCAN_DAYS;
        i += 1
    ) {
        const intervals =
            getWorkingIntervals(
                calendar,
                cursor
            );

        if (!intervals.length) {
            cursor =
                nextWorkingDay(
                    calendar,
                    cursor,
                    false
                );

            continue;
        }

        for (const interval of intervals) {
            const {
                start,
                end
            } =
                intervalStartEnd(
                    cursor,
                    interval
                );

            if (
                cursor.getTime() <
                start.getTime()
            ) {
                return start;
            }

            if (
                cursor.getTime() ===
                    start.getTime() &&
                includeCurrent
            ) {
                return start;
            }

            if (
                cursor.getTime() >
                    start.getTime() &&
                cursor.getTime() <
                    end.getTime()
            ) {
                return cursor;
            }

            /*
             * cursor at interval end:
             * continue to a later interval on the same day.
             */
        }

        cursor =
            nextWorkingDay(
                calendar,
                cursor,
                false
            );
    }

    return new Date(
        date.getTime()
    );
}

export function endOfWorkingTime(
    calendar: ScheduleCalendar,
    date: Date
): Date {
    let cursor =
        new Date(
            date.getTime()
        );

    for (
        let i = 0;
        i <
        MAX_CALENDAR_SCAN_DAYS;
        i += 1
    ) {
        const intervals =
            getWorkingIntervals(
                calendar,
                cursor
            );

        if (intervals.length) {
            for (
                let index =
                    intervals.length - 1;
                index >= 0;
                index -= 1
            ) {
                const {
                    start,
                    end
                } =
                    intervalStartEnd(
                        cursor,
                        intervals[index]
                    );

                if (
                    cursor.getTime() >
                    end.getTime()
                ) {
                    return end;
                }

                if (
                    cursor.getTime() >=
                        start.getTime() &&
                    cursor.getTime() <=
                        end.getTime()
                ) {
                    return cursor;
                }
            }
        }

        const previousDay =
            previousWorkingDay(
                calendar,
                cursor,
                false
            );

        const previousIntervals =
            getWorkingIntervals(
                calendar,
                previousDay
            );

        if (
            previousIntervals.length
        ) {
            const last =
                previousIntervals[
                    previousIntervals.length -
                        1
                ];

            return intervalStartEnd(
                previousDay,
                last
            ).end;
        }

        cursor =
            previousDay;
    }

    return new Date(
        date.getTime()
    );
}

/* -------------------------------------------------------------------------- */
/* Forward working-hours calculation                                          */
/* -------------------------------------------------------------------------- */

export function addWorkingHours(
    calendar: ScheduleCalendar,
    date: Date,
    hours: number
): Date {
    if (
        !Number.isFinite(hours) ||
        Math.abs(hours) <
            Number.EPSILON
    ) {
        return new Date(
            date.getTime()
        );
    }

    if (hours < 0) {
        return subtractWorkingHours(
            calendar,
            date,
            Math.abs(hours)
        );
    }

    let cursor =
        startOfWorkingTime(
            calendar,
            date,
            true
        );

    let remaining = hours;

    for (
        let i = 0;
        i <
        MAX_CALENDAR_SCAN_DAYS * 10;
        i += 1
    ) {
        const intervals =
            getWorkingIntervals(
                calendar,
                cursor
            );

        if (!intervals.length) {
            cursor =
                startOfWorkingTime(
                    calendar,
                    nextWorkingDay(
                        calendar,
                        cursor,
                        false
                    ),
                    true
                );

            continue;
        }

        let consumedToday =
            false;

        for (const interval of intervals) {
            const {
                start,
                end
            } =
                intervalStartEnd(
                    cursor,
                    interval
                );

            if (
                cursor.getTime() <
                start.getTime()
            ) {
                cursor = start;
            }

            if (
                cursor.getTime() >=
                end.getTime()
            ) {
                continue;
            }

            const available =
                (
                    end.getTime() -
                    cursor.getTime()
                ) /
                MS_PER_HOUR;

            if (
                remaining <=
                    available +
                        Number.EPSILON
            ) {
                return new Date(
                    cursor.getTime() +
                        remaining *
                            MS_PER_HOUR
                );
            }

            remaining -= available;
            cursor = end;
            consumedToday = true;
        }

        if (
            consumedToday ||
            remaining > 0
        ) {
            cursor =
                startOfWorkingTime(
                    calendar,
                    nextWorkingDay(
                        calendar,
                        cursor,
                        false
                    ),
                    true
                );
        }
    }

    return cursor;
}

/* -------------------------------------------------------------------------- */
/* Backward working-hours calculation                                         */
/* -------------------------------------------------------------------------- */

export function subtractWorkingHours(
    calendar: ScheduleCalendar,
    date: Date,
    hours: number
): Date {
    if (
        !Number.isFinite(hours) ||
        Math.abs(hours) <
            Number.EPSILON
    ) {
        return new Date(
            date.getTime()
        );
    }

    if (hours < 0) {
        return addWorkingHours(
            calendar,
            date,
            Math.abs(hours)
        );
    }

    let cursor =
        endOfWorkingTime(
            calendar,
            date
        );

    let remaining = hours;

    for (
        let i = 0;
        i <
        MAX_CALENDAR_SCAN_DAYS * 10;
        i += 1
    ) {
        const intervals =
            getWorkingIntervals(
                calendar,
                cursor
            );

        if (!intervals.length) {
            const previousDay =
                previousWorkingDay(
                    calendar,
                    cursor,
                    false
                );

            const previousIntervals =
                getWorkingIntervals(
                    calendar,
                    previousDay
                );

            if (
                previousIntervals.length
            ) {
                const last =
                    previousIntervals[
                        previousIntervals.length -
                            1
                    ];

                cursor =
                    intervalStartEnd(
                        previousDay,
                        last
                    ).end;
            } else {
                cursor =
                    previousDay;
            }

            continue;
        }

        let consumedToday =
            false;

        for (
            let index =
                intervals.length - 1;
            index >= 0;
            index -= 1
        ) {
            const {
                start,
                end
            } =
                intervalStartEnd(
                    cursor,
                    intervals[index]
                );

            if (
                cursor.getTime() >
                end.getTime()
            ) {
                cursor = end;
            }

            if (
                cursor.getTime() <=
                start.getTime()
            ) {
                continue;
            }

            const available =
                (
                    cursor.getTime() -
                    start.getTime()
                ) /
                MS_PER_HOUR;

            if (
                remaining <=
                    available +
                        Number.EPSILON
            ) {
                return new Date(
                    cursor.getTime() -
                        remaining *
                            MS_PER_HOUR
                );
            }

            remaining -= available;
            cursor = start;
            consumedToday = true;
        }

        /*
         * Move directly to the previous working day's
         * final interval.
         *
         * Do NOT call endOfWorkingTime() here.
         */
        if (
            consumedToday ||
            remaining > 0
        ) {
            const previousDay =
                previousWorkingDay(
                    calendar,
                    cursor,
                    false
                );

            const previousIntervals =
                getWorkingIntervals(
                    calendar,
                    previousDay
                );

            if (
                previousIntervals.length
            ) {
                const last =
                    previousIntervals[
                        previousIntervals.length -
                            1
                    ];

                cursor =
                    intervalStartEnd(
                        previousDay,
                        last
                    ).end;
            } else {
                cursor =
                    previousDay;
            }
        }
    }

    return cursor;
}

/* -------------------------------------------------------------------------- */
/* Working-day calculations                                                   */
/* -------------------------------------------------------------------------- */

export function addWorkingDays(
    calendar: ScheduleCalendar,
    date: Date,
    days: number
): Date {
    if (
        !Number.isFinite(days) ||
        Math.abs(days) <
            Number.EPSILON
    ) {
        return new Date(
            date.getTime()
        );
    }

    if (days < 0) {
        return subtractWorkingDays(
            calendar,
            date,
            Math.abs(days)
        );
    }

    const hoursPerDay =
        Math.max(
            0,
            Number(
                calendar.hoursPerDay
            ) || 0
        );

    if (hoursPerDay <= 0) {
        return new Date(
            date.getTime()
        );
    }

    return addWorkingHours(
        calendar,
        date,
        days * hoursPerDay
    );
}

export function subtractWorkingDays(
    calendar: ScheduleCalendar,
    date: Date,
    days: number
): Date {
    if (
        !Number.isFinite(days) ||
        Math.abs(days) <
            Number.EPSILON
    ) {
        return new Date(
            date.getTime()
        );
    }

    if (days < 0) {
        return addWorkingDays(
            calendar,
            date,
            Math.abs(days)
        );
    }

    const hoursPerDay =
        Math.max(
            0,
            Number(
                calendar.hoursPerDay
            ) || 0
        );

    if (hoursPerDay <= 0) {
        return new Date(
            date.getTime()
        );
    }

    return subtractWorkingHours(
        calendar,
        date,
        days * hoursPerDay
    );
}

/* -------------------------------------------------------------------------- */
/* Working duration between dates                                             */
/* -------------------------------------------------------------------------- */

export function workingHoursBetween(
    calendar: ScheduleCalendar,
    start: Date,
    end: Date
): number {
    const startTime =
        start.getTime();

    const endTime =
        end.getTime();

    if (
        startTime ===
        endTime
    ) {
        return 0;
    }

    if (endTime < startTime) {
        return -workingHoursBetween(
            calendar,
            end,
            start
        );
    }

    let total = 0;

    let cursor =
        startOfDay(start);

    const finishDay =
        startOfDay(end);

    for (
        let i = 0;
        i <
            MAX_CALENDAR_SCAN_DAYS &&
        cursor.getTime() <=
            finishDay.getTime();
        i += 1
    ) {
        const intervals =
            getWorkingIntervals(
                calendar,
                cursor
            );

        for (const interval of intervals) {
            const {
                start:
                    intervalStart,
                end:
                    intervalEnd
            } =
                intervalStartEnd(
                    cursor,
                    interval
                );

            const from =
                Math.max(
                    startTime,
                    intervalStart.getTime()
                );

            const to =
                Math.min(
                    endTime,
                    intervalEnd.getTime()
                );

            if (to > from) {
                total +=
                    (
                        to - from
                    ) /
                    MS_PER_HOUR;
            }
        }

        cursor.setDate(
            cursor.getDate() + 1
        );
    }

    return total;
}

export function workingDaysBetween(
    calendar: ScheduleCalendar,
    start: Date,
    end: Date
): number {
    const hoursPerDay =
        Number(
            calendar.hoursPerDay
        ) || 0;

    if (hoursPerDay <= 0) {
        return 0;
    }

    return (
        workingHoursBetween(
            calendar,
            start,
            end
        ) /
        hoursPerDay
    );
}

/* -------------------------------------------------------------------------- */
/* Duration API                                                               */
/* -------------------------------------------------------------------------- */

export function calculateWorkingDuration(
    calendar: ScheduleCalendar,
    start:
        | Date
        | string
        | null
        | undefined,
    finish:
        | Date
        | string
        | null
        | undefined
): number {
    const startDate =
        toDate(start);

    const finishDate =
        toDate(finish);

    if (
        !startDate ||
        !finishDate
    ) {
        return 0;
    }

    if (
        finishDate.getTime() <=
        startDate.getTime()
    ) {
        return 0;
    }

    return workingDaysBetween(
        calendar,
        startDate,
        finishDate
    );
}

export function calculateWorkingDurationHours(
    calendar: ScheduleCalendar,
    start:
        | Date
        | string
        | null
        | undefined,
    finish:
        | Date
        | string
        | null
        | undefined
): number {
    const startDate =
        toDate(start);

    const finishDate =
        toDate(finish);

    if (
        !startDate ||
        !finishDate
    ) {
        return 0;
    }

    if (
        finishDate.getTime() <=
        startDate.getTime()
    ) {
        return 0;
    }

    return workingHoursBetween(
        calendar,
        startDate,
        finishDate
    );
}

/* -------------------------------------------------------------------------- */
/* Calendar exceptions                                                        */
/* -------------------------------------------------------------------------- */

export function addCalendarException(
    calendar: ScheduleCalendar,
    exception: CalendarException
): ScheduleCalendar {
    const exceptionDate =
        toDate(
            exception.date
        );

    if (!exceptionDate) {
        return calendar;
    }

    const normalized:
        CalendarException = {
        ...exception,

        date: dateKey(
            exceptionDate
        ),

        intervals:
            exception.intervals
                ? normalizeIntervals(
                      exception.intervals,
                      calendar.hoursPerDay
                  )
                : undefined
    };

    const existing =
        calendar.exceptions ??
        [];

    const filtered =
        existing.filter(
            item =>
                item.date !==
                normalized.date
        );

    return {
        ...calendar,

        exceptions: [
            ...filtered,
            normalized
        ].sort(
            (a, b) =>
                a.date.localeCompare(
                    b.date
                )
        )
    };
}

export function removeCalendarException(
    calendar: ScheduleCalendar,
    date:
        | Date
        | string
): ScheduleCalendar {
    const key =
        toDate(date);

    if (!key) {
        return calendar;
    }

    return {
        ...calendar,

        exceptions: (
            calendar.exceptions ?? []
        ).filter(
            exception =>
                exception.date !==
                dateKey(key)
        )
    };
}

/* -------------------------------------------------------------------------- */
/* Calendar statistics                                                        */
/* -------------------------------------------------------------------------- */

export function calendarWorkingHours(
    calendar: ScheduleCalendar
): number {
    let weeklyHours = 0;

    for (
        let day = 0;
        day <= 6;
        day += 1
    ) {
        const date =
            new Date(
                2024,
                0,
                7 + day
            );

        weeklyHours +=
            getWorkingHoursPerDay(
                calendar,
                date
            );
    }

    return weeklyHours;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const calendarConstants = {
    MS_PER_HOUR,
    MS_PER_DAY,
    MAX_CALENDAR_SCAN_DAYS
};

