import type {
    CalendarException,
    CalendarInterval,
    ScheduleCalendar,
    ScheduleActivity
} from "./scheduleTypes";

export type BuiltInCalendarId =
    | "standard-5-day"
    | "six-day-sat-thu"
    | "six-day-sun-fri"
    | "seven-day"
    | "24x7";

export interface CalendarRegistryOptions {
    calendars?: ScheduleCalendar[];
    projectCalendarId?: string | null;
}

export interface CalendarAssignment {
    projectCalendarId: string;
    activityCalendarIds: Record<string, string | null>;
}

const WEEKDAYS_5: Record<number, boolean> = {
    0: false,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false
};

const WEEKDAYS_6_SAT_THU: Record<number, boolean> = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: false,
    6: true
};

const WEEKDAYS_6_SUN_FRI: Record<number, boolean> = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false
};

const WEEKDAYS_7: Record<number, boolean> = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true
};

const WEEKDAYS_24X7 = WEEKDAYS_7;

function dayDefinition(working: boolean): { working: boolean; intervals?: CalendarInterval[] } {
    return working
        ? { working: true, intervals: [{ startHour: 8, endHour: 16 }] }
        : { working: false, intervals: [] };
}

function buildWeek(pattern: Record<number, boolean>): ScheduleCalendar["week"] {
    return Object.fromEntries(
        Object.entries(pattern).map(([day, working]) => [
            Number(day),
            dayDefinition(working)
        ])
    );
}

function cloneCalendar(calendar: ScheduleCalendar): ScheduleCalendar {
    return {
        ...calendar,
        defaultIntervals: calendar.defaultIntervals.map(interval => ({ ...interval })),
        week: Object.fromEntries(
            Object.entries(calendar.week).map(([day, definition]) => [
                Number(day),
                {
                    ...definition,
                    intervals: definition.intervals?.map(interval => ({ ...interval }))
                }
            ])
        ),
        exceptions: calendar.exceptions?.map(exception => ({
            ...exception,
            intervals: exception.intervals?.map(interval => ({ ...interval }))
        }))
    };
}

export function createBuiltInCalendars(): ScheduleCalendar[] {
    const standardIntervals: CalendarInterval[] = [
        { startHour: 8, endHour: 16 }
    ];

    const twentyFourHourIntervals: CalendarInterval[] = [
        { startHour: 0, endHour: 24 }
    ];

    return [
        {
            id: "standard-5-day",
            name: "Standard 5-Day",
            hoursPerDay: 8,
            defaultIntervals: standardIntervals,
            week: buildWeek(WEEKDAYS_5),
            exceptions: []
        },
        {
            id: "six-day-sat-thu",
            name: "Six-Day (Sat–Thu)",
            hoursPerDay: 8,
            defaultIntervals: standardIntervals,
            week: buildWeek(WEEKDAYS_6_SAT_THU),
            exceptions: []
        },
        {
            id: "six-day-sun-fri",
            name: "Six-Day (Sun–Fri)",
            hoursPerDay: 8,
            defaultIntervals: standardIntervals,
            week: buildWeek(WEEKDAYS_6_SUN_FRI),
            exceptions: []
        },
        {
            id: "seven-day",
            name: "Seven-Day",
            hoursPerDay: 8,
            defaultIntervals: standardIntervals,
            week: buildWeek(WEEKDAYS_7),
            exceptions: []
        },
        {
            id: "24x7",
            name: "24×7",
            hoursPerDay: 24,
            defaultIntervals: twentyFourHourIntervals,
            week: Object.fromEntries(
                Object.keys(WEEKDAYS_24X7).map(day => [
                    Number(day),
                    { working: true, intervals: twentyFourHourIntervals.map(interval => ({ ...interval })) }
                ])
            ),
            exceptions: []
        }
    ];
}

export function createDefaultCalendarRegistry(): ScheduleCalendar[] {
    return createBuiltInCalendars();
}

export function getCalendarById(
    calendars: ScheduleCalendar[],
    calendarId: string | null | undefined
): ScheduleCalendar | null {
    if (!calendarId) return null;
    const calendar = calendars.find(item => item.id === calendarId);
    return calendar ? cloneCalendar(calendar) : null;
}

export function resolveCalendarForActivity(
    activity: Pick<ScheduleActivity, "calendarId">,
    calendars: ScheduleCalendar[],
    projectCalendarId: string
): ScheduleCalendar {
    const requestedId = activity.calendarId || projectCalendarId;
    const selected = getCalendarById(calendars, requestedId);
    if (selected) return selected;

    const project = getCalendarById(calendars, projectCalendarId);
    if (project) return project;

    const fallback = createBuiltInCalendars()[0];
    return fallback;
}

export function assignProjectCalendar(
    projectCalendarId: string,
    calendars: ScheduleCalendar[]
): string {
    if (getCalendarById(calendars, projectCalendarId)) {
        return projectCalendarId;
    }

    return calendars[0]?.id ?? "standard-5-day";
}

export function setActivityCalendar(
    assignment: CalendarAssignment,
    activityId: string,
    calendarId: string | null
): CalendarAssignment {
    return {
        ...assignment,
        activityCalendarIds: {
            ...assignment.activityCalendarIds,
            [activityId]: calendarId
        }
    };
}

export function getActivityCalendarId(
    assignment: CalendarAssignment,
    activityId: string
): string {
    return assignment.activityCalendarIds[activityId] || assignment.projectCalendarId;
}

export function addCalendarException(
    calendar: ScheduleCalendar,
    exception: CalendarException
): ScheduleCalendar {
    const existing = calendar.exceptions ?? [];
    const withoutSameDate = existing.filter(item => item.date !== exception.date);

    return {
        ...cloneCalendar(calendar),
        exceptions: [...withoutSameDate, { ...exception }].sort((a, b) =>
            a.date.localeCompare(b.date)
        )
    };
}

export function removeCalendarException(
    calendar: ScheduleCalendar,
    date: string
): ScheduleCalendar {
    return {
        ...cloneCalendar(calendar),
        exceptions: (calendar.exceptions ?? []).filter(item => item.date !== date)
    };
}

export function updateCalendarWeekDay(
    calendar: ScheduleCalendar,
    dayOfWeek: number,
    working: boolean,
    intervals?: CalendarInterval[]
): ScheduleCalendar {
    const day = Math.max(0, Math.min(6, Math.trunc(dayOfWeek)));
    const next = cloneCalendar(calendar);

    next.week[day] = {
        working,
        intervals: working
            ? (intervals ?? next.defaultIntervals).map(interval => ({ ...interval }))
            : []
    };

    return next;
}

export function updateCalendarDefaultIntervals(
    calendar: ScheduleCalendar,
    intervals: CalendarInterval[]
): ScheduleCalendar {
    const normalized = intervals
        .map(interval => ({
            startHour: Math.max(0, Math.min(24, interval.startHour)),
            endHour: Math.max(0, Math.min(24, interval.endHour))
        }))
        .filter(interval => interval.endHour > interval.startHour)
        .sort((a, b) => a.startHour - b.startHour);

    const hoursPerDay = normalized.reduce(
        (total, interval) => total + interval.endHour - interval.startHour,
        0
    );

    return {
        ...cloneCalendar(calendar),
        defaultIntervals: normalized,
        hoursPerDay
    };
}

export function validateCalendar(calendar: ScheduleCalendar): string[] {
    const warnings: string[] = [];

    if (!calendar.id.trim()) warnings.push("Calendar ID is required.");
    if (!calendar.name.trim()) warnings.push("Calendar name is required.");
    if (calendar.hoursPerDay <= 0) warnings.push("Hours per day must be greater than zero.");

    for (const [day, definition] of Object.entries(calendar.week)) {
        if (Number(day) < 0 || Number(day) > 6) {
            warnings.push(`Invalid weekday: ${day}.`);
        }

        for (const interval of definition.intervals ?? []) {
            if (interval.startHour < 0 || interval.endHour > 24 || interval.endHour <= interval.startHour) {
                warnings.push(`Invalid working interval on weekday ${day}.`);
            }
        }
    }

    for (const exception of calendar.exceptions ?? []) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(exception.date)) {
            warnings.push(`Invalid exception date: ${exception.date}.`);
        }
    }

    return warnings;
}

export function upsertCalendar(
    calendars: ScheduleCalendar[],
    calendar: ScheduleCalendar
): ScheduleCalendar[] {
    const copy = cloneCalendar(calendar);
    const index = calendars.findIndex(item => item.id === copy.id);

    if (index < 0) {
        return [...calendars, copy];
    }

    return calendars.map((item, itemIndex) =>
        itemIndex === index ? copy : item
    );
}

export function removeCalendar(
    calendars: ScheduleCalendar[],
    calendarId: string,
    protectedCalendarIds: string[] = ["standard-5-day"]
): ScheduleCalendar[] {
    if (protectedCalendarIds.includes(calendarId)) {
        return calendars;
    }

    return calendars.filter(calendar => calendar.id !== calendarId);
}

export function createCalendarAssignment(
    projectCalendarId: string,
    activities: ScheduleActivity[]
): CalendarAssignment {
    return {
        projectCalendarId,
        activityCalendarIds: Object.fromEntries(
            activities.map(activity => [activity.id, activity.calendarId ?? null])
        )
    };
}
