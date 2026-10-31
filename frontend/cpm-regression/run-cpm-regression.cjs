const {
    scheduleProject
} = require("./cpmScheduler.js");


const STANDARD_CALENDAR = {
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
            working: false,
            intervals: []
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
            working: false,
            intervals: []
        }
    },

    exceptions: []
};


const CALENDARS = {
    standard: STANDARD_CALENDAR
};


function activity(
    id,
    name,
    duration,
    predecessors = []
) {
    return {
        id,
        code: id,
        name,
        duration,
        calendarId: "standard",
        predecessors
    };
}


function relationship(
    predecessorId,
    successorId,
    type,
    lag = 0,
    lagUnit = "days"
) {
    return {
        predecessorId,
        successorId,
        type,
        lag,
        lagUnit
    };
}


function formatDate(value) {
    if (!value) {
        return "NULL";
    }

    return value.toISOString();
}


function formatHours(value) {
    return Number(value).toFixed(2);
}


function printActivity(
    result,
    id
) {
    const item =
        result.activities[id];

    if (!item) {
        console.log(
            `${id}: NOT FOUND`
        );

        return;
    }

    console.log(
        [
            `${id}`,
            `ES=${formatDate(item.earlyStart)}`,
            `EF=${formatDate(item.earlyFinish)}`,
            `LS=${formatDate(item.lateStart)}`,
            `LF=${formatDate(item.lateFinish)}`,
            `Dur=${formatHours(item.duration)}`,
            `DurH=${formatHours(item.durationHours)}`,
            `TF=${formatHours(item.totalFloat)}`,
            `FF=${formatHours(item.freeFloat)}`,
            `DF=${formatHours(item.drivingFloat)}`,
            `Critical=${item.isCritical}`
        ].join(" | ")
    );
}


function printResult(
    title,
    result
) {
    console.log("");
    console.log("============================================================");
    console.log(title);
    console.log("============================================================");

    console.log(
        `Project Start : ${formatDate(result.projectStart)}`
    );

    console.log(
        `Project Finish: ${formatDate(result.projectFinish)}`
    );

    console.log(
        `Project Dur   : ${formatHours(result.projectDuration)} days`
    );

    console.log(
        `Project DurH  : ${formatHours(result.projectDurationHours)} hours`
    );

    console.log(
        `Critical Path : ${JSON.stringify(result.criticalPath)}`
    );

    console.log(
        `Warnings      : ${JSON.stringify(result.warnings)}`
    );

    console.log("");
}


function runScenario1() {
    const activities = [
        activity(
            "A",
            "Activity A",
            2
        ),

        activity(
            "B",
            "Activity B",
            3,
            [
                relationship(
                    "A",
                    "B",
                    "FS"
                )
            ]
        ),

        activity(
            "C",
            "Activity C",
            2,
            [
                relationship(
                    "B",
                    "C",
                    "SS",
                    1,
                    "days"
                )
            ]
        ),

        activity(
            "D",
            "Activity D",
            1,
            [
                relationship(
                    "B",
                    "D",
                    "FF"
                )
            ]
        )
    ];

    const result =
        scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart:
                    new Date(
                        "2026-09-07T08:00:00"
                    ),

                defaultCalendarId:
                    "standard"
            }
        );

    printResult(
        "SCENARIO 1 — FS + SS+1d + FF",
        result
    );

    printActivity(result, "A");
    printActivity(result, "B");
    printActivity(result, "C");
    printActivity(result, "D");

    return result;
}


function runWeekendScenario() {
    const activities = [
        activity(
            "A",
            "Weekend Test",
            2
        )
    ];

    const result =
        scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart:
                    new Date(
                        "2026-09-11T08:00:00"
                    ),

                defaultCalendarId:
                    "standard"
            }
        );

    printResult(
        "SCENARIO 2 — 5-Day Weekend",
        result
    );

    printActivity(result, "A");

    return result;
}


function runSSScenario() {
    const activities = [
        activity(
            "A",
            "Predecessor",
            2
        ),

        activity(
            "B",
            "Successor",
            1,
            [
                relationship(
                    "A",
                    "B",
                    "SS",
                    1,
                    "days"
                )
            ]
        )
    ];

    const result =
        scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart:
                    new Date(
                        "2026-09-07T08:00:00"
                    ),

                defaultCalendarId:
                    "standard"
            }
        );

    printResult(
        "SCENARIO 3 — SS + 1 Working Day",
        result
    );

    printActivity(result, "A");
    printActivity(result, "B");

    return result;
}


function runFFScenario() {
    const activities = [
        activity(
            "A",
            "Predecessor",
            3
        ),

        activity(
            "B",
            "Successor",
            1,
            [
                relationship(
                    "A",
                    "B",
                    "FF"
                )
            ]
        )
    ];

    const result =
        scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart:
                    new Date(
                        "2026-09-07T08:00:00"
                    ),

                defaultCalendarId:
                    "standard"
            }
        );

    printResult(
        "SCENARIO 4 — FF",
        result
    );

    printActivity(result, "A");
    printActivity(result, "B");

    return result;
}


/**
 * Isolated CPM regression scenario.
 *
 * Purpose:
 * Validate the backward pass using the
 * simplest possible FS-only network:
 *
 * A = 2 working days
 * B = 2 working days
 * A -> B = FS
 *
 * Expected:
 *
 * A:
 *   ES = Monday 08:00
 *   EF = Tuesday 16:00
 *   LS = Monday 08:00
 *   LF = Tuesday 16:00
 *
 * B:
 *   ES = Wednesday 08:00
 *   EF = Thursday 16:00
 *   LS = Wednesday 08:00
 *   LF = Thursday 16:00
 *
 * Both activities should have:
 *   Total Float = 0
 *   Free Float  = 0
 *   Critical    = true
 *
 * Critical path:
 *   ["A", "B"]
 */
function runPureFSScenario() {
    const activities = [
        activity(
            "A",
            "Activity A",
            2
        ),

        activity(
            "B",
            "Activity B",
            2,
            [
                relationship(
                    "A",
                    "B",
                    "FS"
                )
            ]
        )
    ];

    const result =
        scheduleProject(
            activities,
            CALENDARS,
            {
                projectStart:
                    new Date(
                        "2026-09-07T08:00:00"
                    ),

                defaultCalendarId:
                    "standard"
            }
        );

    printResult(
        "SCENARIO 5 — Pure FS Chain",
        result
    );

    printActivity(result, "A");
    printActivity(result, "B");

    return result;
}


console.log("");
console.log("PCS CPM REGRESSION RUNNER");

console.log(
    "Node:",
    process.version
);

console.log(
    "Started:",
    new Date().toISOString()
);


runScenario1();

runWeekendScenario();

runSSScenario();

runFFScenario();

runPureFSScenario();


console.log("");

console.log(
    "============================================================"
);

console.log(
    "REGRESSION RUN COMPLETE"
);

console.log(
    "============================================================"
);