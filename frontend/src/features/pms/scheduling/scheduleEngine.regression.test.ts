import { describe, expect, it } from "vitest";

import { scheduleProject } from "./cpmScheduler";

import type {
    ScheduleActivity,
    ScheduleCalendar,
    ScheduleRelationship
} from "./scheduleTypes";

const STANDARD_CALENDAR: ScheduleCalendar = {
    id: "standard",
    name: "Standard 5-Day",
    hoursPerDay: 8,

    defaultIntervals: [
        {
            startHour: 8,
            endHour: 16
        }
    ],

    week: {
        0: {
            working: false
        },
        1: {
            working: true,
            intervals: [
                {
                    startHour: 8,
                    endHour: 16
                }
            ]
        },
        2: {
            working: true,
            intervals: [
                {
                    startHour: 8,
                    endHour: 16
                }
            ]
        },
        3: {
            working: true,
            intervals: [
                {
                    startHour: 8,
                    endHour: 16
                }
            ]
        },
        4: {
            working: true,
            intervals: [
                {
                    startHour: 8,
                    endHour: 16
                }
            ]
        },
        5: {
            working: true,
            intervals: [
                {
                    startHour: 8,
                    endHour: 16
                }
            ]
        },
        6: {
            working: false
        }
    },

    exceptions: []
};

const HOLIDAY_CALENDAR: ScheduleCalendar = {
    ...STANDARD_CALENDAR,
    id: "holiday-calendar",
    name: "Standard 5-Day + Holiday",

    exceptions: [
        {
            date: "2026-09-08",
            working: false,
            name: "Test Holiday"
        }
    ]
};

const CALENDARS: Record<string, ScheduleCalendar> = {
    standard: STANDARD_CALENDAR,
    "holiday-calendar": HOLIDAY_CALENDAR
};

function localDate(
    year: number,
    month: number,
    day: number,
    hour = 8,
    minute = 0
): Date {
    return new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
        0
    );
}

const PROJECT_START = localDate(
    2026,
    9,
    7,
    8
);

function createRelationship(
    predecessorId: string,
    successorId: string,
    type: ScheduleRelationship["type"],
    lag = 0,
    lagUnit: ScheduleRelationship["lagUnit"] = "days"
): ScheduleRelationship {
    return {
        predecessorId,
        successorId,
        type,
        lag,
        lagUnit
    };
}

function createActivity(
    id: string,
    name: string,
    duration: number,
    predecessors: ScheduleRelationship[] = [],
    overrides: Partial<ScheduleActivity> = {}
): ScheduleActivity {
    return {
        id,
        code: id,
        name,
        duration,
        calendarId: "standard",
        predecessors,
        ...overrides
    };
}

function expectLocalDateTime(
    value: Date | null,
    expected: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute?: number;
    }
): void {
    expect(value).not.toBeNull();

    expect(value!.getFullYear()).toBe(expected.year);
    expect(value!.getMonth() + 1).toBe(expected.month);
    expect(value!.getDate()).toBe(expected.day);
    expect(value!.getHours()).toBe(expected.hour);
    expect(value!.getMinutes()).toBe(expected.minute ?? 0);
}

function expectSameDate(
    actual: Date | null,
    expected: Date | null
): void {
    expect(actual).not.toBeNull();
    expect(expected).not.toBeNull();

    expect(actual!.getTime()).toBe(
        expected!.getTime()
    );
}

describe("CPM scheduling engine regression", () => {
    it("calculates a basic FS network with working duration", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Activity A",
                2
            ),

            createActivity(
                "B",
                "Activity B",
                3,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        expectLocalDateTime(
            a.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 7,
                hour: 8
            }
        );

        expectLocalDateTime(
            a.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 8,
                hour: 16
            }
        );

        expectLocalDateTime(
            b.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 8,
                hour: 16
            }
        );

        expectLocalDateTime(
            b.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 11,
                hour: 16
            }
        );

        expect(a.duration).toBe(2);
        expect(a.durationHours).toBe(16);

        expect(b.duration).toBe(3);
        expect(b.durationHours).toBe(24);

        expect(result.projectDuration).toBe(5);
        expect(result.projectDurationHours).toBe(40);
    });

    it("calculates SS relationships with positive lag", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Predecessor",
                2
            ),

            createActivity(
                "B",
                "Successor",
                1,
                [
                    createRelationship(
                        "A",
                        "B",
                        "SS",
                        1
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        expectLocalDateTime(
            a.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 7,
                hour: 8
            }
        );

        expectLocalDateTime(
            b.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 8,
                hour: 8
            }
        );
    });

    it("calculates FF relationships correctly", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Predecessor",
                3
            ),

            createActivity(
                "B",
                "Successor",
                1,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FF"
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        expectSameDate(
            b.earlyFinish,
            a.earlyFinish
        );

        expectLocalDateTime(
            a.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 16
            }
        );

        expectLocalDateTime(
            b.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 8,
                hour: 16
            }
        );

        expectLocalDateTime(
            b.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 16
            }
        );
    });

    it("calculates SF relationships correctly", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Predecessor",
                2
            ),

            createActivity(
                "B",
                "Successor",
                1,
                [
                    createRelationship(
                        "A",
                        "B",
                        "SF"
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        /*
         * SF requires B to finish at or after A's start.
         * With a one-day duration, Friday 16:00 is the earliest
         * feasible boundary; the next working interval is Monday
         * 08:00-16:00, so B finishes Monday 16:00.
         */
        expect(
            b.earlyFinish!.getTime()
        ).toBeGreaterThanOrEqual(
            a.earlyStart!.getTime()
        );

        expectLocalDateTime(
            b.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 7,
                hour: 16
            }
        );

        expectLocalDateTime(
            b.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 4,
                hour: 16
            }
        );
    });

    it("supports positive FS lag in working days", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Predecessor",
                2
            ),

            createActivity(
                "B",
                "Successor",
                1,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS",
                        1
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const b = result.activities.B;

        expect(b).toBeDefined();

        /*
         * A finishes Tuesday 16:00.
         * FS + 1 working day => Wednesday 16:00.
         */
        expectLocalDateTime(
            b.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 16
            }
        );
    });

    it("supports negative FS lag in working days", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Predecessor",
                2
            ),

            createActivity(
                "B",
                "Successor",
                1,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS",
                        -1
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const b = result.activities.B;

        expect(b).toBeDefined();

        /*
         * A finishes Tuesday 16:00.
         * FS - 1 working day => Monday 16:00.
         */
        expectLocalDateTime(
            b.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 7,
                hour: 16
            }
        );
    });

    it("respects the 5-day calendar weekend", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Weekend Test",
                2
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: localDate(
                    2026,
                    9,
                    11,
                    8
                ),
                defaultCalendarId: "standard"
            }
        );

        const activity = result.activities.A;

        expect(activity).toBeDefined();

        /*
         * Friday 08:00 + 2 working days
         * => Monday 16:00.
         */
        expectLocalDateTime(
            activity.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 11,
                hour: 8
            }
        );

        expectLocalDateTime(
            activity.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 14,
                hour: 16
            }
        );
    });

    it("skips a non-working calendar exception", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Holiday Test",
                2,
                [],
                {
                    calendarId: "holiday-calendar"
                }
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "holiday-calendar"
            }
        );

        const activity = result.activities.A;

        expect(activity).toBeDefined();

        /*
         * Monday = working
         * Tuesday = holiday
         * Wednesday = working
         *
         * 2 working days:
         * Monday 08:00 -> Wednesday 16:00
         */
        expectLocalDateTime(
            activity.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 7,
                hour: 8
            }
        );

        expectLocalDateTime(
            activity.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 16
            }
        );
    });

    it("uses working-time duration rather than calendar-time duration", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Two Working Days",
                2
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const activity = result.activities.A;

        expect(activity).toBeDefined();

        expect(activity.duration).toBe(2);
        expect(activity.durationHours).toBe(16);

        expectLocalDateTime(
            activity.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 7,
                hour: 8
            }
        );

        expectLocalDateTime(
            activity.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 8,
                hour: 16
            }
        );
    });

    it("calculates backward LS and LF correctly", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Activity A",
                2
            ),

            createActivity(
                "B",
                "Activity B",
                2,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                projectFinish: localDate(
                    2026,
                    9,
                    10,
                    16
                ),
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        /*
         * Network:
         *
         * A: Mon 08 -> Tue 16
         * B: Tue 16 -> Thu 16
         *
         * Project Finish = Thu 16
         *
         * Therefore:
         * B LF = Thu 16
         * B LS = Wed 08
         *
         * A LF = Wed 08
         * A LS = Mon 08
         */
        expectLocalDateTime(
            b.lateFinish,
            {
                year: 2026,
                month: 9,
                day: 10,
                hour: 16
            }
        );

        expectLocalDateTime(
            b.lateStart,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 8
            }
        );

        expectLocalDateTime(
            a.lateFinish,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 8
            }
        );

        expectLocalDateTime(
            a.lateStart,
            {
                year: 2026,
                month: 9,
                day: 7,
                hour: 8
            }
        );

        expect(a.totalFloat).toBe(0);
        expect(b.totalFloat).toBe(0);

        expect(a.isCritical).toBe(true);
        expect(b.isCritical).toBe(true);
    });

    it("calculates zero and positive float correctly", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Activity A",
                2
            ),

            createActivity(
                "B",
                "Activity B",
                2,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                projectFinish: localDate(
                    2026,
                    9,
                    14,
                    16
                ),
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        /*
         * Network finishes Thursday.
         * Project horizon is Monday.
         *
         * B therefore has positive float.
         * A is the driving predecessor and has zero free float,
         * but both activities retain positive total float against
         * the explicit project-finish horizon.
         */
        expect(a.totalFloat).toBeGreaterThan(0);
        expect(b.totalFloat).toBeGreaterThan(0);

        expect(a.freeFloat).toBe(0);
        expect(a.drivingFloat).toBe(0);
        expect(b.freeFloat).toBeGreaterThan(0);

        expect(a.isCritical).toBe(false);
        expect(b.isCritical).toBe(false);
    });

    it("calculates negative total float when project finish horizon is impossible", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Activity A",
                2
            ),

            createActivity(
                "B",
                "Activity B",
                2,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            )
        ];

        const requestedProjectFinish = localDate(
            2026,
            9,
            9,
            16
        );

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                projectFinish: requestedProjectFinish,
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        /*
         * Network finish:
         * Thursday 10-Sep 16:00
         *
         * Required project finish:
         * Wednesday 09-Sep 16:00
         *
         * Therefore the network has negative float.
         */
        expectSameDate(
            result.projectFinish,
            requestedProjectFinish
        );

        expect(a.totalFloat).toBeLessThan(0);
        expect(b.totalFloat).toBeLessThan(0);

        expect(a.isCritical).toBe(true);
        expect(b.isCritical).toBe(true);
    });

    it("calculates free float independently from total float", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Activity A",
                1
            ),

            createActivity(
                "B",
                "Activity B",
                1,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                projectFinish: localDate(
                    2026,
                    9,
                    11,
                    16
                ),
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;

        expect(a).toBeDefined();
        expect(b).toBeDefined();

        /*
         * A immediately drives B.
         * Therefore A has zero free float.
         *
         * B is terminal and has available float before
         * the explicit project finish horizon.
         */
        expect(a.freeFloat).toBe(0);
        expect(b.freeFloat).toBeGreaterThan(0);

        expect(b.totalFloat).toBeGreaterThan(0);
    });

    it("distinguishes critical activities from the selected driving critical path", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Main Predecessor",
                2
            ),

            createActivity(
                "B",
                "Main Successor",
                2,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            ),

            createActivity(
                "C",
                "Parallel Critical Branch",
                4
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;
        const c = result.activities.C;

        expect(a).toBeDefined();
        expect(b).toBeDefined();
        expect(c).toBeDefined();

        /*
         * A -> B and C both finish at the project horizon.
         *
         * More than one activity may therefore be critical.
         * criticalPath represents one selected driving chain,
         * while isCritical represents the activity-level
         * criticality.
         */
        expect(a.isCritical).toBe(true);
        expect(b.isCritical).toBe(true);
        expect(c.isCritical).toBe(true);

        expect(result.criticalPath.length).toBeGreaterThan(0);

        for (const activityId of result.criticalPath) {
            expect(
                result.activities[activityId].isCritical
            ).toBe(true);
        }

        expect(
            result.criticalPath[0]
        ).toBeDefined();
    });

    it("handles milestones as zero-duration activities", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Start Milestone",
                0,
                [],
                {
                    isMilestone: true,
                    activityType: "StartMilestone"
                }
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const milestone = result.activities.A;

        expect(milestone).toBeDefined();

        expect(milestone.duration).toBe(0);
        expect(milestone.durationHours).toBe(0);

        expectSameDate(
            milestone.earlyStart,
            milestone.earlyFinish
        );

        expectSameDate(
            milestone.lateStart,
            milestone.lateFinish
        );
    });

    it("honors StartOnOrAfter constraints", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Constrained Activity",
                1,
                [],
                {
                    constraintType: "StartOnOrAfter",
                    constraintDate: "2026-09-09T08:00:00"
                }
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const activity = result.activities.A;

        expect(activity).toBeDefined();

        expectLocalDateTime(
            activity.earlyStart,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 8
            }
        );

        expectLocalDateTime(
            activity.earlyFinish,
            {
                year: 2026,
                month: 9,
                day: 9,
                hour: 16
            }
        );
    });

    it("preserves an explicit project finish horizon", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Activity A",
                2
            ),

            createActivity(
                "B",
                "Activity B",
                2,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            )
        ];

        const projectFinish = localDate(
            2026,
            9,
            9,
            16
        );

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                projectFinish,
                defaultCalendarId: "standard"
            }
        );

        expectSameDate(
            result.projectFinish,
            projectFinish
        );

        /*
         * The actual network is later than the required
         * project finish, therefore negative float must
         * be exposed instead of silently extending the
         * project finish.
         */
        expect(
            result.activities.A.totalFloat
        ).toBeLessThan(0);

        expect(
            result.activities.B.totalFloat
        ).toBeLessThan(0);
    });

    it("produces a zero-float critical path for a fully constrained network", () => {
        const activities: ScheduleActivity[] = [
            createActivity(
                "A",
                "Activity A",
                1
            ),

            createActivity(
                "B",
                "Activity B",
                1,
                [
                    createRelationship(
                        "A",
                        "B",
                        "FS"
                    )
                ]
            ),

            createActivity(
                "C",
                "Activity C",
                1,
                [
                    createRelationship(
                        "B",
                        "C",
                        "FS"
                    )
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        const a = result.activities.A;
        const b = result.activities.B;
        const c = result.activities.C;

        expect(a).toBeDefined();
        expect(b).toBeDefined();
        expect(c).toBeDefined();

        expect(a.totalFloat).toBe(0);
        expect(b.totalFloat).toBe(0);
        expect(c.totalFloat).toBe(0);

        expect(a.isCritical).toBe(true);
        expect(b.isCritical).toBe(true);
        expect(c.isCritical).toBe(true);

        expect(result.criticalPath).toEqual([
            "A",
            "B",
            "C"
        ]);
    });

    it("schedules an FS successor on its own six-day calendar", () => {
        const sixDayCalendar: ScheduleCalendar = {
            ...STANDARD_CALENDAR,
            id: "six-day",
            name: "Six-Day Saturday-Thursday",
            week: {
                ...STANDARD_CALENDAR.week,
                6: {
                    working: true,
                    intervals: [
                        {
                            startHour: 8,
                            endHour: 16
                        }
                    ]
                }
            }
        };

        const activities: ScheduleActivity[] = [
            createActivity("A", "Engineering", 1, [], {
                calendarId: "standard"
            }),
            createActivity(
                "B",
                "Weekend Construction",
                1,
                [createRelationship("A", "B", "FS")],
                { calendarId: "six-day" }
            )
        ];

        const result = scheduleProject(
            activities,
            {
                ...CALENDARS,
                "six-day": sixDayCalendar
            },
            {
                projectStart: localDate(2026, 9, 11, 8),
                defaultCalendarId: "standard"
            }
        );

        expectLocalDateTime(result.activities.A.earlyFinish, {
            year: 2026,
            month: 9,
            day: 11,
            hour: 16
        });
        expectLocalDateTime(result.activities.B.earlyStart, {
            year: 2026,
            month: 9,
            day: 11,
            hour: 16
        });
        expectLocalDateTime(result.activities.B.earlyFinish, {
            year: 2026,
            month: 9,
            day: 12,
            hour: 16
        });
    });

    it("uses every predecessor when calculating a converging EPC work package", () => {
        const activities: ScheduleActivity[] = [
            createActivity("CIV", "Civil works", 1),
            createActivity("MECH", "Mechanical works", 2),
            createActivity(
                "PRECOM",
                "Pre-commissioning",
                1,
                [
                    createRelationship("CIV", "PRECOM", "FS"),
                    createRelationship("MECH", "PRECOM", "FS")
                ]
            )
        ];

        const result = scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart: PROJECT_START,
                defaultCalendarId: "standard"
            }
        );

        expectLocalDateTime(result.activities.CIV.earlyFinish, {
            year: 2026,
            month: 9,
            day: 7,
            hour: 16
        });
        expectLocalDateTime(result.activities.MECH.earlyFinish, {
            year: 2026,
            month: 9,
            day: 8,
            hour: 16
        });
        expectLocalDateTime(result.activities.PRECOM.earlyStart, {
            year: 2026,
            month: 9,
            day: 8,
            hour: 16
        });
        expectLocalDateTime(result.activities.PRECOM.earlyFinish, {
            year: 2026,
            month: 9,
            day: 9,
            hour: 16
        });
    });


    it("validates FS, SS, FF and SF links together in one EPC network", () => {
        const activities: ScheduleActivity[] = [
            createActivity("A", "Engineering", 2),
            createActivity("B", "Procurement", 1, [
                createRelationship("A", "B", "FS")
            ]),
            createActivity("C", "Fabrication", 1, [
                createRelationship("A", "C", "SS")
            ]),
            createActivity("D", "Inspection", 1, [
                createRelationship("B", "D", "FF")
            ]),
            createActivity("E", "Early works", 1, [
                createRelationship("C", "E", "SF")
            ])
        ];

        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });

        for (const id of ["A", "B", "C", "D", "E"]) {
            expect(result.activities[id].earlyStart).not.toBeNull();
            expect(result.activities[id].earlyFinish).not.toBeNull();
        }

        expect(result.activities.B.earlyStart!.getTime())
            .toBeGreaterThanOrEqual(result.activities.A.earlyFinish!.getTime());
        expect(result.activities.C.earlyStart!.getTime())
            .toBeGreaterThanOrEqual(result.activities.A.earlyStart!.getTime());
        expect(result.activities.D.earlyFinish!.getTime())
            .toBeGreaterThanOrEqual(result.activities.B.earlyFinish!.getTime());
        expect(result.activities.E.earlyFinish!.getTime())
            .toBeGreaterThanOrEqual(result.activities.C.earlyStart!.getTime());
    });

    it("honors different holiday exceptions on predecessor and successor calendars", () => {
        const constructionCalendar: ScheduleCalendar = {
            ...STANDARD_CALENDAR,
            id: "construction",
            name: "Construction Calendar",
            exceptions: [
                {
                    date: "2026-09-09",
                    working: false,
                    name: "Construction Shutdown"
                }
            ]
        };

        const engineeringCalendar: ScheduleCalendar = {
            ...STANDARD_CALENDAR,
            exceptions: [
                {
                    date: "2026-09-08",
                    working: false,
                    name: "Engineering Holiday"
                }
            ]
        };

        const activities: ScheduleActivity[] = [
            createActivity("ENG", "Engineering", 2, [], {
                calendarId: "engineering"
            }),
            createActivity("SITE", "Site Execution", 1, [
                createRelationship("ENG", "SITE", "FS")
            ], {
                calendarId: "construction"
            })
        ];

        const result = scheduleProject(
            activities,
            {
                engineering: engineeringCalendar,
                construction: constructionCalendar
            },
            {
                projectStart: localDate(2026, 9, 7, 8),
                defaultCalendarId: "engineering"
            }
        );

        expectLocalDateTime(result.activities.ENG.earlyFinish, {
            year: 2026, month: 9, day: 9, hour: 16
        });
        expectLocalDateTime(result.activities.SITE.earlyStart, {
            year: 2026, month: 9, day: 10, hour: 8
        });
        expectLocalDateTime(result.activities.SITE.earlyFinish, {
            year: 2026, month: 9, day: 10, hour: 16
        });
    });

    it("rejects a circular dependency network without publishing CPM dates", () => {
        const activities: ScheduleActivity[] = [
            createActivity("A", "Activity A", 1, [
                createRelationship("B", "A", "FS")
            ]),
            createActivity("B", "Activity B", 1, [
                createRelationship("A", "B", "FS")
            ]),
            createActivity("C", "Independent Activity", 1)
        ];

        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });

        expect(result.criticalPath).toEqual([]);
        expect(result.projectStart).toBeNull();
        expect(result.projectFinish).toBeNull();
        expect(result.warnings.some(warning => warning.includes("Circular relationship")))
            .toBe(true);

        for (const activity of Object.values(result.activities)) {
            expect(activity.earlyStart).toBeNull();
            expect(activity.earlyFinish).toBeNull();
            expect(activity.lateStart).toBeNull();
            expect(activity.lateFinish).toBeNull();
            expect(activity.isCritical).toBe(false);
        }
    });

    it("detects a self-referencing dependency instead of silently discarding it", () => {
        const activities: ScheduleActivity[] = [
            createActivity("A", "Self Referencing Activity", 1, [
                createRelationship("A", "A", "FS")
            ])
        ];

        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });

        expect(result.activities.A.earlyStart).toBeNull();
        expect(result.activities.A.earlyFinish).toBeNull();
        expect(result.criticalPath).toEqual([]);
        expect(result.warnings.some(warning => warning.includes("Circular relationship")))
            .toBe(true);
    });

    it("identifies the driving branch in a parallel EPC network", () => {
        const activities: ScheduleActivity[] = [
            createActivity("START", "Project Start", 1),
            createActivity("LONG", "Long Lead Equipment", 4, [
                createRelationship("START", "LONG", "FS")
            ]),
            createActivity("SHORT", "Site Preparation", 1, [
                createRelationship("START", "SHORT", "FS")
            ]),
            createActivity("INTEGRATE", "System Integration", 1, [
                createRelationship("LONG", "INTEGRATE", "FS"),
                createRelationship("SHORT", "INTEGRATE", "FS")
            ])
        ];

        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });

        expect(result.activities.START.totalFloat).toBe(0);
        expect(result.activities.LONG.totalFloat).toBe(0);
        expect(result.activities.INTEGRATE.totalFloat).toBe(0);
        expect(result.activities.SHORT.totalFloat).toBeGreaterThan(0);
        expect(result.activities.START.isCritical).toBe(true);
        expect(result.activities.LONG.isCritical).toBe(true);
        expect(result.activities.SHORT.isCritical).toBe(false);
        expect(result.activities.INTEGRATE.isCritical).toBe(true);
        expect(result.criticalPath).toEqual([
            "START",
            "LONG",
            "INTEGRATE"
        ]);
    });

    it("schedules a wide network of 10000 independent EPC activities", () => {
        const activities: ScheduleActivity[] = Array.from(
            { length: 10000 },
            (_, index) => createActivity(
                `WIDE-${index + 1}`,
                `Independent EPC Activity ${index + 1}`,
                1
            )
        );

        const startedAt = Date.now();
        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });
        const elapsedMs = Date.now() - startedAt;

        expect(Object.keys(result.activities)).toHaveLength(10000);
        expect(result.activities["WIDE-1"].earlyStart).not.toBeNull();
        expect(result.activities["WIDE-10000"].earlyFinish).not.toBeNull();
        expect(elapsedMs).toBeLessThan(10000);
    });

    it("schedules a 1000-activity dependency chain", () => {
        const activities: ScheduleActivity[] = Array.from(
            { length: 1000 },
            (_, index) => createActivity(
                `A${index + 1}`,
                `EPC Activity ${index + 1}`,
                0.125,
                index === 0
                    ? []
                    : [
                        createRelationship(
                            `A${index}`,
                            `A${index + 1}`,
                            "FS"
                        )
                    ]
            )
        );

        const startedAt = Date.now();
        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });
        const elapsedMs = Date.now() - startedAt;

        expect(Object.keys(result.activities)).toHaveLength(1000);
        expect(result.criticalPath).toHaveLength(1000);
        expect(result.activities.A1.earlyStart).not.toBeNull();
        expect(result.activities.A1000.earlyFinish).not.toBeNull();
        expect(elapsedMs).toBeLessThan(10000);
    });

    it("schedules a 5000-activity fan-out network using indexed relationships", () => {
        const activityCount = 5000;
        const activities: ScheduleActivity[] = [
            createActivity("FAN-ROOT", "EPC Root Activity", 1),
            ...Array.from(
                { length: activityCount - 1 },
                (_, index) => createActivity(
                    `FAN-${index + 1}`,
                    `EPC Successor ${index + 1}`,
                    1,
                    [
                        createRelationship(
                            "FAN-ROOT",
                            `FAN-${index + 1}`,
                            "FS"
                        )
                    ]
                )
            )
        ];

        const startedAt = Date.now();
        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });
        const elapsedMs = Date.now() - startedAt;

        expect(Object.keys(result.activities)).toHaveLength(activityCount);
        expect(result.activities["FAN-ROOT"].earlyFinish).not.toBeNull();
        expect(result.activities["FAN-4999"].earlyStart).not.toBeNull();
        expect(result.criticalPath).toHaveLength(2);
        expect(elapsedMs).toBeLessThan(10000);
    });

    it("selects a 10000-activity critical path without recursive stack growth", () => {
        const activityCount = 10000;
        const activities: ScheduleActivity[] = Array.from(
            { length: activityCount },
            (_, index) => createActivity(
                `DEEP-${index + 1}`,
                `Deep EPC Activity ${index + 1}`,
                0.125,
                index === 0
                    ? []
                    : [
                        createRelationship(
                            `DEEP-${index}`,
                            `DEEP-${index + 1}`,
                            "FS"
                        )
                    ]
            )
        );

        const startedAt = Date.now();
        const result = scheduleProject(activities, CALENDARS, {
            projectStart: PROJECT_START,
            defaultCalendarId: "standard"
        });
        const elapsedMs = Date.now() - startedAt;

        expect(Object.keys(result.activities)).toHaveLength(activityCount);
        expect(result.criticalPath).toHaveLength(activityCount);
        expect(result.criticalPath[0]).toBe("DEEP-1");
        expect(result.criticalPath[activityCount - 1]).toBe("DEEP-10000");
        expect(result.activities["DEEP-10000"].earlyFinish).not.toBeNull();
        expect(elapsedMs).toBeLessThan(15000);
    });

});
