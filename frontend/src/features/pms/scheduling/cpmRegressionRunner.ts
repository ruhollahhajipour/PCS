import {
    scheduleProject
} from "./cpmScheduler";

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

function assert(
    condition: boolean,
    message: string
): void {
    if (!condition) {
        throw new Error(message);
    }
}

function assertDate(
    value: Date | null,
    expected: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute?: number;
    },
    label: string
): void {
    assert(
        value !== null,
        `${label}: expected date but received null`
    );

    const minute = expected.minute ?? 0;

    assert(
        value!.getFullYear() === expected.year &&
        value!.getMonth() + 1 === expected.month &&
        value!.getDate() === expected.day &&
        value!.getHours() === expected.hour &&
        value!.getMinutes() === minute,
        `${label}: expected ${expected.year}-${String(expected.month).padStart(2, "0")}-${String(expected.day).padStart(2, "0")} ${String(expected.hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}, got ${value!.toString()}`
    );
}

function assertSameDate(
    actual: Date | null,
    expected: Date | null,
    label: string
): void {
    assert(
        actual !== null,
        `${label}: actual date is null`
    );

    assert(
        expected !== null,
        `${label}: expected date is null`
    );

    assert(
        actual!.getTime() === expected!.getTime(),
        `${label}: dates are different`
    );
}

function assertAfterOrEqual(
    actual: Date | null,
    reference: Date | null,
    label: string
): void {
    assert(
        actual !== null,
        `${label}: actual date is null`
    );

    assert(
        reference !== null,
        `${label}: reference date is null`
    );

    assert(
        actual!.getTime() >= reference!.getTime(),
        `${label}: ${actual!.toString()} must be on or after ${reference!.toString()}`
    );
}

function assertBeforeOrEqual(
    actual: Date | null,
    reference: Date | null,
    label: string
): void {
    assert(
        actual !== null,
        `${label}: actual date is null`
    );

    assert(
        reference !== null,
        `${label}: reference date is null`
    );

    assert(
        actual!.getTime() <= reference!.getTime(),
        `${label}: ${actual!.toString()} must be on or before ${reference!.toString()}`
    );
}

function assertWorkingDayBoundary(
    value: Date | null,
    label: string
): void {
    assert(
        value !== null,
        `${label}: date is null`
    );

    const hour = value!.getHours();
    const minute = value!.getMinutes();

    assert(
        (
            hour === 8 ||
            hour === 16
        ) &&
        minute === 0,
        `${label}: expected working-time boundary, got ${value!.toString()}`
    );
}

function runTest(
    name: string,
    test: () => void
): boolean {
    try {
        test();

        console.log(`✓ ${name}`);

        return true;
    } catch (error) {
        console.error(`✗ ${name}`);

        if (error instanceof Error) {
            console.error(`  ${error.message}`);
        } else {
            console.error(`  ${String(error)}`);
        }

        return false;
    }
}

const results: boolean[] = [];

console.log("");
console.log("==================================================");
console.log(" PCS CPM REGRESSION RUNNER");
console.log("==================================================");
console.log("");

/*
 * 01
 * FS relationship
 *
 * The successor must not start before the predecessor finishes.
 *
 * Because the calendar works from 08:00 to 16:00, a successor
 * constrained by FS at a 16:00 boundary is normalized to the
 * next working period, i.e. 08:00 of the next working day.
 */
results.push(
    runTest(
        "FS relationship",
        () => {
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

            assertDate(
                a.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 7,
                    hour: 8
                },
                "A earlyStart"
            );

            assertDate(
                a.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 8,
                    hour: 16
                },
                "A earlyFinish"
            );

            assertAfterOrEqual(
                b.earlyStart,
                a.earlyFinish,
                "FS successor start"
            );

            assertWorkingDayBoundary(
                b.earlyStart,
                "FS successor start"
            );

            assertDate(
                b.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 9,
                    hour: 8
                },
                "B earlyStart"
            );

            assertDate(
                b.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 11,
                    hour: 16
                },
                "B earlyFinish"
            );
        }
    )
);

/*
 * 02
 * SS + positive lag
 */
results.push(
    runTest(
        "SS + positive lag",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Activity A",
                    2
                ),
                createActivity(
                    "B",
                    "Activity B",
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

            assertDate(
                result.activities.B.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 8,
                    hour: 8
                },
                "B earlyStart"
            );
        }
    )
);

/*
 * 03
 * FF relationship
 *
 * FF constrains the successor finish, not the successor start.
 *
 * A = 3 working days
 * B = 1 working day
 *
 * A finishes Wednesday 16:00.
 * Therefore B must finish at exactly the same time.
 * Its one-day duration starts Wednesday 08:00.
 */
results.push(
    runTest(
        "FF relationship",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Activity A",
                    3
                ),
                createActivity(
                    "B",
                    "Activity B",
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

            assertSameDate(
                b.earlyFinish,
                a.earlyFinish,
                "FF finish synchronization"
            );

            assertDate(
                b.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 9,
                    hour: 8
                },
                "B earlyStart"
            );
        }
    )
);

/*
 * 04
 * SF relationship
 *
 * SF means:
 *
 *     Finish(B) >= Start(A) + Lag
 *
 * It does NOT require exact timestamp equality when the successor
 * duration cannot physically fit before the predecessor start.
 *
 * A is constrained to Monday 08:00.
 * B has one working day duration.
 *
 * With a standard Mon-Fri 08:00-16:00 calendar, there is no
 * one-working-day interval that finishes exactly at Monday 08:00.
 *
 * Therefore the earliest feasible B is:
 *
 *     B Start  = Monday 08:00
 *     B Finish = Monday 16:00
 *
 * This is the correct working-calendar interpretation of SF.
 */
results.push(
    runTest(
        "SF relationship",
        () => {
            const mondayStart = localDate(
                2026,
                9,
                7,
                8
            );

            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Activity A",
                    2,
                    [],
                    {
                        constraintType: "StartOnOrAfter",
                        constraintDate:
                            mondayStart.toISOString()
                    }
                ),
                createActivity(
                    "B",
                    "Activity B",
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
                    projectStart: localDate(
                        2026,
                        9,
                        4,
                        8
                    ),
                    defaultCalendarId: "standard"
                }
            );

            const a = result.activities.A;
            const b = result.activities.B;

            /*
             * The predecessor constraint must still be respected.
             */
            assertDate(
                a.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 7,
                    hour: 8
                },
                "A earlyStart"
            );

            /*
             * SF is a finish lower-bound relationship.
             *
             * We intentionally do not use assertSameDate here because
             * exact equality is impossible for a one-day successor
             * ending at Monday 08:00 on this working calendar.
             */
            assertAfterOrEqual(
                b.earlyFinish,
                a.earlyStart,
                "SF finish/start constraint"
            );

            /*
             * The scheduler must choose the earliest feasible working
             * start that satisfies the SF finish boundary.
             */
            assertDate(
                b.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 7,
                    hour: 8
                },
                "B earlyStart"
            );

            assertDate(
                b.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 7,
                    hour: 16
                },
                "B earlyFinish"
            );
        }
    )
);

/*
 * 05
 * FS + positive lag
 *
 * A finishes Tuesday 16:00.
 * One working day lag moves the successor to Thursday 08:00.
 */
results.push(
    runTest(
        "FS + positive lag",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Activity A",
                    2
                ),
                createActivity(
                    "B",
                    "Activity B",
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

            const a = result.activities.A;
            const b = result.activities.B;

            assertDate(
                a.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 8,
                    hour: 16
                },
                "A earlyFinish"
            );

            assertDate(
                b.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 10,
                    hour: 8
                },
                "FS +1 lag"
            );

            assertAfterOrEqual(
                b.earlyStart,
                a.earlyFinish,
                "FS +1 successor start"
            );
        }
    )
);

/*
 * 06
 * FS + negative lag
 *
 * A finishes Tuesday 16:00.
 * One working day negative lag places B at Tuesday 08:00.
 */
results.push(
    runTest(
        "FS + negative lag",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Activity A",
                    2
                ),
                createActivity(
                    "B",
                    "Activity B",
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

            const a = result.activities.A;
            const b = result.activities.B;

            assertDate(
                a.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 8,
                    hour: 16
                },
                "A earlyFinish"
            );

            assertDate(
                b.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 8,
                    hour: 8
                },
                "FS -1 lag"
            );

            assertBeforeOrEqual(
                b.earlyStart,
                a.earlyFinish,
                "FS -1 successor start"
            );
        }
    )
);

/*
 * 07
 * 5-day weekend
 */
results.push(
    runTest(
        "5-day weekend",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Weekend Activity",
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

            assertDate(
                result.activities.A.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 14,
                    hour: 16
                },
                "Weekend finish"
            );
        }
    )
);

/*
 * 08
 * Calendar holiday exception
 */
results.push(
    runTest(
        "Calendar holiday exception",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Holiday Activity",
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
                    defaultCalendarId:
                        "holiday-calendar"
                }
            );

            assertDate(
                result.activities.A.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 9,
                    hour: 16
                },
                "Holiday-aware finish"
            );
        }
    )
);

/*
 * 09
 * Working duration
 */
results.push(
    runTest(
        "Working duration",
        () => {
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

            assert(
                activity.duration === 2,
                "Duration must remain 2 days"
            );

            assert(
                activity.durationHours === 16,
                "Duration must equal 16 working hours"
            );

            assertDate(
                activity.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 8,
                    hour: 16
                },
                "Working duration finish"
            );
        }
    )
);

/*
 * 10
 * Backward LS/LF
 */
results.push(
    runTest(
        "Backward LS/LF",
        () => {
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

            assertDate(
                b.lateFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 10,
                    hour: 16
                },
                "B lateFinish"
            );

            assertDate(
                b.lateStart,
                {
                    year: 2026,
                    month: 9,
                    day: 9,
                    hour: 8
                },
                "B lateStart"
            );

            assertDate(
                a.lateFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 9,
                    hour: 8
                },
                "A lateFinish"
            );

            assertDate(
                a.lateStart,
                {
                    year: 2026,
                    month: 9,
                    day: 7,
                    hour: 8
                },
                "A lateStart"
            );

            assert(
                a.totalFloat === 0,
                `A total float expected 0, got ${a.totalFloat}`
            );

            assert(
                b.totalFloat === 0,
                `B total float expected 0, got ${b.totalFloat}`
            );
        }
    )
);

/*
 * 11
 * Positive float
 */
results.push(
    runTest(
        "Positive float",
        () => {
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

            const b = result.activities.B;

            assert(
                b.totalFloat > 0,
                `B must have positive total float, got ${b.totalFloat}`
            );

            assert(
                b.freeFloat > 0,
                `B must have positive free float, got ${b.freeFloat}`
            );

            assert(
                b.isCritical === false,
                "B must not be critical"
            );
        }
    )
);

/*
 * 12
 * Negative float
 */
results.push(
    runTest(
        "Negative float",
        () => {
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

            assertSameDate(
                result.projectFinish,
                projectFinish,
                "Explicit project finish"
            );

            assert(
                result.activities.A.totalFloat < 0,
                "A must have negative total float"
            );

            assert(
                result.activities.B.totalFloat < 0,
                "B must have negative total float"
            );

            assert(
                result.activities.A.isCritical,
                "A must be critical"
            );

            assert(
                result.activities.B.isCritical,
                "B must be critical"
            );
        }
    )
);

/*
 * 13
 * Free float
 */
results.push(
    runTest(
        "Free float",
        () => {
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

            assert(
                a.freeFloat === 0,
                `A free float must be 0, got ${a.freeFloat}`
            );

            assert(
                b.freeFloat > 0,
                `B free float must be positive, got ${b.freeFloat}`
            );
        }
    )
);

/*
 * 14
 * Critical activities and selected critical path
 */
results.push(
    runTest(
        "Critical activities and selected critical path",
        () => {
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
                    "Parallel Branch",
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

            assert(
                result.activities.A.isCritical,
                "A must be critical"
            );

            assert(
                result.activities.B.isCritical,
                "B must be critical"
            );

            assert(
                result.activities.C.isCritical,
                "C must be critical"
            );

            assert(
                result.criticalPath.length > 0,
                "Critical path must not be empty"
            );

            for (const id of result.criticalPath) {
                assert(
                    result.activities[id].isCritical,
                    `${id} in criticalPath must be critical`
                );
            }
        }
    )
);

/*
 * 15
 * Milestone
 */
results.push(
    runTest(
        "Milestone",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "M",
                    "Milestone",
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

            const milestone = result.activities.M;

            assert(
                milestone.duration === 0,
                "Milestone duration must be zero"
            );

            assert(
                milestone.durationHours === 0,
                "Milestone duration hours must be zero"
            );

            assertSameDate(
                milestone.earlyStart,
                milestone.earlyFinish,
                "Milestone early dates"
            );

            assertSameDate(
                milestone.lateStart,
                milestone.lateFinish,
                "Milestone late dates"
            );
        }
    )
);

/*
 * 16
 * StartOnOrAfter constraint
 */
results.push(
    runTest(
        "StartOnOrAfter constraint",
        () => {
            const activities: ScheduleActivity[] = [
                createActivity(
                    "A",
                    "Constrained Activity",
                    1,
                    [],
                    {
                        constraintType: "StartOnOrAfter",
                        constraintDate:
                            "2026-09-09T08:00:00"
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

            assertDate(
                result.activities.A.earlyStart,
                {
                    year: 2026,
                    month: 9,
                    day: 9,
                    hour: 8
                },
                "Constraint earlyStart"
            );

            assertDate(
                result.activities.A.earlyFinish,
                {
                    year: 2026,
                    month: 9,
                    day: 9,
                    hour: 16
                },
                "Constraint earlyFinish"
            );
        }
    )
);

/*
 * 17
 * Explicit project finish horizon
 */
results.push(
    runTest(
        "Explicit project finish horizon",
        () => {
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

            assertSameDate(
                result.projectFinish,
                projectFinish,
                "Project finish horizon"
            );

            assert(
                result.activities.A.totalFloat < 0,
                "A must have negative float"
            );

            assert(
                result.activities.B.totalFloat < 0,
                "B must have negative float"
            );
        }
    )
);

/*
 * 18
 * Simple zero-float critical path
 *
 * This test is intentionally strict.
 *
 * A -> B -> C is one continuous FS chain.
 * All three activities must have zero total float and
 * the selected critical path must preserve the complete
 * connected chain.
 *
 * We do NOT weaken this assertion merely to make the
 * regression suite green.
 */
results.push(
    runTest(
        "Simple zero-float critical path",
        () => {
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

            assert(
                result.activities.A.totalFloat === 0,
                "A float must be zero"
            );

            assert(
                result.activities.B.totalFloat === 0,
                "B float must be zero"
            );

            assert(
                result.activities.C.totalFloat === 0,
                "C float must be zero"
            );

            assert(
                result.activities.A.isCritical,
                "A must be critical"
            );

            assert(
                result.activities.B.isCritical,
                "B must be critical"
            );

            assert(
                result.activities.C.isCritical,
                "C must be critical"
            );

            assert(
                JSON.stringify(
                    result.criticalPath
                ) ===
                JSON.stringify(
                    ["A", "B", "C"]
                ),
                `Unexpected critical path: ${JSON.stringify(result.criticalPath)}`
            );
        }
    )
);

const passed =
    results.filter(Boolean).length;

const failed =
    results.length - passed;

console.log("");
console.log("==================================================");
console.log(` PASSED: ${passed}`);
console.log(` FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) {
    throw new Error(
        `CPM regression failed: ${failed} test(s) failed.`
    );
} else {
    console.log("RESULT: PASS");
}