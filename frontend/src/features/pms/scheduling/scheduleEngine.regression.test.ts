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
         * SF means the successor finish must be at or after
         * the predecessor start. The project start anchor is
         * Monday 08:00, so the successor cannot start on Friday.
         * Its earliest feasible finish is Monday 16:00.
         */
        expect(b.earlyFinish!.getTime()).toBeGreaterThanOrEqual(
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
                day: 7,
                hour: 8
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
         * A is constrained by B, so its free float remains zero.
         */
        expect(a.totalFloat).toBeGreaterThanOrEqual(0);
        expect(b.totalFloat).toBeGreaterThan(0);

        expect(a.freeFloat).toBe(0);
        expect(b.freeFloat).toBeGreaterThan(0);

        // A serial chain shares total float; neither task is critical
        // while the project finish horizon remains later than the network finish.
        expect(a.totalFloat).toBe(b.totalFloat);
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
});
