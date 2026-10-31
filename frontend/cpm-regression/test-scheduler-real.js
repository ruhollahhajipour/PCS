const { scheduleProject } = require("./cpmScheduler.js");

const {
    getDefaultCalendar,
    startOfWorkingTime,
    addWorkingDays,
    addWorkingHours
} = require("./calendarEngine.js");

const calendar = getDefaultCalendar();

const scheduleOptions = {
    projectStart: new Date(2026, 8, 7, 8, 0, 0, 0),
    defaultCalendarId: "default",
    deriveDurationFromDates: true
};

const EPSILON = 0.000001;

function printActivity(result, id) {
    const a = result.activities[id];

    if (!a) {
        console.log(`\n[${id}] NOT FOUND`);
        return;
    }

    console.log(`\n[${id}]`);
    console.log("ES       :", a.earlyStart?.toISOString());
    console.log("EF       :", a.earlyFinish?.toISOString());
    console.log("LS       :", a.lateStart?.toISOString());
    console.log("LF       :", a.lateFinish?.toISOString());
    console.log("Duration :", a.duration);
    console.log("Hours    :", a.durationHours);
    console.log("TF       :", a.totalFloat);
    console.log("FF       :", a.freeFloat);
    console.log("Driving  :", a.drivingFloat);
    console.log("Critical :", a.isCritical);
}

function printProject(result) {
    console.log("\n=== PROJECT ===");
    console.log("Start    :", result.projectStart?.toISOString());
    console.log("Finish   :", result.projectFinish?.toISOString());
    console.log("Duration :", result.projectDuration);
    console.log("Hours    :", result.projectDurationHours);
}

function printCriticalPath(result) {
    console.log("\n=== CRITICAL PATH ===");
    console.log(result.criticalPath);
}

function printWarnings(result) {
    console.log("\n=== WARNINGS ===");
    console.log(result.warnings);
}

function runMixedRelationshipScenario() {
    const activities = [
        {
            id: "A",
            name: "Activity A",
            duration: 2
        },
        {
            id: "B",
            name: "Activity B",
            duration: 3,
            predecessors: [
                {
                    predecessorId: "A",
                    successorId: "B",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "C",
            name: "Activity C",
            duration: 2,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "C",
                    type: "SS",
                    lag: 1,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "D",
            name: "Activity D",
            duration: 1,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "D",
                    type: "FF",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        }
    ];

    const result = scheduleProject(
        activities,
        {
            default: calendar
        },
        scheduleOptions
    );

    console.log("");
    console.log("============================================================");
    console.log("SCENARIO 1 — FS + SS+1d + FF");
    console.log("============================================================");

    printProject(result);

    console.log("\n=== ACTIVITIES ===");

    for (const id of ["A", "B", "C", "D"]) {
        printActivity(result, id);
    }

    printCriticalPath(result);
    printWarnings(result);

    return result;
}

function runFloatScenario() {
    const activities = [
        {
            id: "A",
            name: "Activity A",
            duration: 2
        },
        {
            id: "B",
            name: "Activity B",
            duration: 3,
            predecessors: [
                {
                    predecessorId: "A",
                    successorId: "B",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "C",
            name: "Short Non-Critical Branch",
            duration: 1,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "C",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "D",
            name: "Long Critical Branch",
            duration: 3,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "D",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        }
    ];

    const result = scheduleProject(
        activities,
        {
            default: calendar
        },
        scheduleOptions
    );

    console.log("");
    console.log("============================================================");
    console.log("SCENARIO 2 — FLOAT REGRESSION");
    console.log("============================================================");

    printProject(result);

    console.log("\n=== ACTIVITIES ===");

    for (const id of ["A", "B", "C", "D"]) {
        printActivity(result, id);
    }

    printCriticalPath(result);
    printWarnings(result);

    console.log("\n=== FLOAT CHECK ===");

    const a = result.activities.A;
    const b = result.activities.B;
    const c = result.activities.C;
    const d = result.activities.D;

    console.log("A TF expected = 0       | actual =", a?.totalFloat);
    console.log("B TF expected = 0       | actual =", b?.totalFloat);
    console.log("C TF expected = 2       | actual =", c?.totalFloat);
    console.log("D TF expected = 0       | actual =", d?.totalFloat);

    console.log("A Critical expected=true  | actual =", a?.isCritical);
    console.log("B Critical expected=true  | actual =", b?.isCritical);
    console.log("C Critical expected=false | actual =", c?.isCritical);
    console.log("D Critical expected=true  | actual =", d?.isCritical);

    console.log("\n=== FLOAT ASSERTIONS ===");

    const checks = [
        {
            name: "A Total Float",
            expected: 0,
            actual: a?.totalFloat
        },
        {
            name: "B Total Float",
            expected: 0,
            actual: b?.totalFloat
        },
        {
            name: "C Total Float",
            expected: 2,
            actual: c?.totalFloat
        },
        {
            name: "D Total Float",
            expected: 0,
            actual: d?.totalFloat
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const check of checks) {
        const ok =
            Number.isFinite(check.actual) &&
            Math.abs(check.actual - check.expected) < EPSILON;

        console.log(
            `${ok ? "PASS" : "FAIL"} | ${check.name} | expected=${check.expected} | actual=${check.actual}`
        );

        if (ok) {
            passed += 1;
        } else {
            failed += 1;
        }
    }

    console.log("");
    console.log(
        `Float assertions: ${passed} passed, ${failed} failed`
    );

    return result;
}

function runFloatStressScenario() {
    const activities = [
        {
            id: "A",
            name: "Stress Root",
            duration: 2
        },
        {
            id: "B",
            name: "Stress Main",
            duration: 2,
            predecessors: [
                {
                    predecessorId: "A",
                    successorId: "B",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "C",
            name: "Main Branch",
            duration: 2,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "C",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "D",
            name: "Long Branch",
            duration: 4,
            predecessors: [
                {
                    predecessorId: "C",
                    successorId: "D",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "E",
            name: "SS Lag Branch",
            duration: 1,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "E",
                    type: "SS",
                    lag: 2,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "F",
            name: "Terminal Continuation",
            duration: 2,
            predecessors: [
                {
                    predecessorId: "D",
                    successorId: "F",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        }
    ];

    const result = scheduleProject(
        activities,
        {
            default: calendar
        },
        scheduleOptions
    );

    console.log("");
    console.log("============================================================");
    console.log("SCENARIO 3 — FLOAT STRESS REGRESSION");
    console.log("============================================================");

    printProject(result);

    console.log("\n=== ACTIVITIES ===");

    for (const id of ["A", "B", "C", "D", "E", "F"]) {
        printActivity(result, id);
    }

    printCriticalPath(result);
    printWarnings(result);

    console.log("\n=== FLOAT MATRIX ===");

    console.log(
        "Activity | Total Float | Free Float | Driving Float | Critical"
    );

    console.log(
        "---------|-------------|------------|---------------|---------"
    );

    for (const id of ["A", "B", "C", "D", "E", "F"]) {
        const a = result.activities[id];

        if (!a) {
            console.log(`${id.padEnd(8)} | NOT FOUND`);
            continue;
        }

        console.log(
            `${id.padEnd(8)} | ` +
            `${String(a.totalFloat).padEnd(11)} | ` +
            `${String(a.freeFloat).padEnd(10)} | ` +
            `${String(a.drivingFloat).padEnd(13)} | ` +
            `${String(a.isCritical)}`
        );
    }

    console.log("\n=== STRESS ASSERTIONS ===");

    let passed = 0;
    let failed = 0;

    function runCheck(name, condition, details) {
        const ok = Boolean(condition);

        console.log(
            `${ok ? "PASS" : "FAIL"} | ${name}` +
            (details ? ` | ${details}` : "")
        );

        if (ok) {
            passed += 1;
        } else {
            failed += 1;
        }
    }

    const ids = ["A", "B", "C", "D", "E", "F"];

    for (const id of ids) {
        const a = result.activities[id];

        runCheck(
            `${id} Total Float finite`,
            a && Number.isFinite(a.totalFloat),
            `actual=${a?.totalFloat}`
        );

        runCheck(
            `${id} Free Float finite`,
            a && Number.isFinite(a.freeFloat),
            `actual=${a?.freeFloat}`
        );

        runCheck(
            `${id} Driving Float finite`,
            a && Number.isFinite(a.drivingFloat),
            `actual=${a?.drivingFloat}`
        );

        runCheck(
            `${id} Total Float non-negative`,
            a && a.totalFloat >= -EPSILON,
            `actual=${a?.totalFloat}`
        );

        runCheck(
            `${id} Free Float non-negative`,
            a && a.freeFloat >= -EPSILON,
            `actual=${a?.freeFloat}`
        );

        runCheck(
            `${id} Driving Float non-negative`,
            a && a.drivingFloat >= -EPSILON,
            `actual=${a?.drivingFloat}`
        );
    }

    runCheck(
        "Critical path exists",
        Array.isArray(result.criticalPath) &&
            result.criticalPath.length > 0,
        `path=${JSON.stringify(result.criticalPath)}`
    );

    runCheck(
        "Project finish exists",
        result.projectFinish instanceof Date &&
            !Number.isNaN(result.projectFinish.getTime()),
        `finish=${result.projectFinish?.toISOString()}`
    );

    const criticalActivities = ids.filter(
        id => result.activities[id]?.isCritical === true
    );

    runCheck(
        "At least one critical activity exists",
        criticalActivities.length > 0,
        `critical=${JSON.stringify(criticalActivities)}`
    );

    const criticalFloatViolations = criticalActivities.filter(
        id =>
            Math.abs(
                result.activities[id].totalFloat
            ) > EPSILON
    );

    runCheck(
        "Critical activities have zero Total Float",
        criticalFloatViolations.length === 0,
        `violations=${JSON.stringify(criticalFloatViolations)}`
    );

    const floatDifferences = ids
        .map(id => {
            const a = result.activities[id];

            if (!a) {
                return null;
            }

            return {
                id,
                totalFloat: a.totalFloat,
                freeFloat: a.freeFloat,
                drivingFloat: a.drivingFloat,
                ffDiffersFromTf:
                    Math.abs(a.totalFloat - a.freeFloat) > EPSILON,
                drivingDiffersFromTf:
                    Math.abs(a.totalFloat - a.drivingFloat) > EPSILON,
                drivingDiffersFromFf:
                    Math.abs(a.freeFloat - a.drivingFloat) > EPSILON
            };
        })
        .filter(Boolean);

    console.log("\n=== FLOAT DIFFERENCE ANALYSIS ===");

    for (const item of floatDifferences) {
        console.log(
            `${item.id} | ` +
            `TF=${item.totalFloat} | ` +
            `FF=${item.freeFloat} | ` +
            `Driving=${item.drivingFloat} | ` +
            `TF!=FF=${item.ffDiffersFromTf} | ` +
            `TF!=Driving=${item.drivingDiffersFromTf} | ` +
            `FF!=Driving=${item.drivingDiffersFromFf}`
        );
    }

    const hasTfFfDifference = floatDifferences.some(
        item => item.ffDiffersFromTf
    );

    const hasDrivingDifference = floatDifferences.some(
        item =>
            item.drivingDiffersFromTf ||
            item.drivingDiffersFromFf
    );

    console.log("");
    console.log(
        `TF / FF difference detected       : ${hasTfFfDifference}`
    );

    console.log(
        `Driving Float difference detected : ${hasDrivingDifference}`
    );

    console.log("\n=== STRESS RESULT ===");

    if (hasTfFfDifference && hasDrivingDifference) {
        console.log(
            "PASS | Scenario produced distinct Float behaviors."
        );
    } else {
        console.log(
            "INFO | Scenario completed, but TF/FF/Driving did not all diverge."
        );
        console.log(
            "INFO | This is diagnostic information, not a scheduler failure."
        );
    }

    console.log("");
    console.log(
        `Stress assertions: ${passed} passed, ${failed} failed`
    );

    return result;
}

/**
 * Scenario 4 — Free Float Stress Regression
 *
 * Purpose:
 * Create a valid case where:
 *
 * Total Float > Free Float
 *
 * Network:
 *
 * A -> B -> C
 *
 * D is an independent, longer terminal activity.
 *
 * A/B/C are therefore non-critical and have project-level slack.
 *
 * B directly feeds C. Because C starts immediately after B,
 * B's Free Float is expected to be smaller than its Total Float.
 *
 * This scenario is specifically intended to validate that
 * Free Float is not simply copied from Total Float.
 */
function runFreeFloatStressScenario() {
    const activities = [
        {
            id: "A",
            name: "Short Chain A",
            duration: 1
        },
        {
            id: "B",
            name: "Short Chain B",
            duration: 1,
            predecessors: [
                {
                    predecessorId: "A",
                    successorId: "B",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "C",
            name: "Short Chain C",
            duration: 1,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "C",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "D",
            name: "Independent Long Critical Activity",
            duration: 5
        }
    ];

    const result = scheduleProject(
        activities,
        {
            default: calendar
        },
        scheduleOptions
    );

    console.log("");
    console.log("============================================================");
    console.log("SCENARIO 4 — FREE FLOAT STRESS REGRESSION");
    console.log("============================================================");

    printProject(result);

    console.log("\n=== ACTIVITIES ===");

    for (const id of ["A", "B", "C", "D"]) {
        printActivity(result, id);
    }

    printCriticalPath(result);
    printWarnings(result);

    console.log("\n=== FLOAT MATRIX ===");

    console.log(
        "Activity | Total Float | Free Float | Driving Float | Critical"
    );

    console.log(
        "---------|-------------|------------|---------------|---------"
    );

    for (const id of ["A", "B", "C", "D"]) {
        const a = result.activities[id];

        if (!a) {
            console.log(`${id.padEnd(8)} | NOT FOUND`);
            continue;
        }

        console.log(
            `${id.padEnd(8)} | ` +
            `${String(a.totalFloat).padEnd(11)} | ` +
            `${String(a.freeFloat).padEnd(10)} | ` +
            `${String(a.drivingFloat).padEnd(13)} | ` +
            `${String(a.isCritical)}`
        );
    }

    console.log("\n=== FREE FLOAT ASSERTIONS ===");

    const a = result.activities.A;
    const b = result.activities.B;
    const c = result.activities.C;
    const d = result.activities.D;

    let passed = 0;
    let failed = 0;

    function check(name, condition, details) {
        const ok = Boolean(condition);

        console.log(
            `${ok ? "PASS" : "FAIL"} | ${name}` +
            (details ? ` | ${details}` : "")
        );

        if (ok) {
            passed += 1;
        } else {
            failed += 1;
        }
    }

    check(
        "A exists",
        Boolean(a),
        `exists=${Boolean(a)}`
    );

    check(
        "B exists",
        Boolean(b),
        `exists=${Boolean(b)}`
    );

    check(
        "C exists",
        Boolean(c),
        `exists=${Boolean(c)}`
    );

    check(
        "D exists",
        Boolean(d),
        `exists=${Boolean(d)}`
    );

    for (const id of ["A", "B", "C", "D"]) {
        const activity = result.activities[id];

        check(
            `${id} TF finite`,
            activity && Number.isFinite(activity.totalFloat),
            `actual=${activity?.totalFloat}`
        );

        check(
            `${id} FF finite`,
            activity && Number.isFinite(activity.freeFloat),
            `actual=${activity?.freeFloat}`
        );
    }

    check(
        "D is critical",
        d?.isCritical === true,
        `actual=${d?.isCritical}`
    );

    check(
        "D Total Float = 0",
        d && Math.abs(d.totalFloat) < EPSILON,
        `actual=${d?.totalFloat}`
    );

    check(
        "Short chain has positive Total Float",
        b && b.totalFloat > 0,
        `B TF=${b?.totalFloat}`
    );

    check(
        "B Free Float is smaller than B Total Float",
        b &&
            Number.isFinite(b.totalFloat) &&
            Number.isFinite(b.freeFloat) &&
            b.freeFloat < b.totalFloat,
        `B TF=${b?.totalFloat}, B FF=${b?.freeFloat}`
    );

    check(
        "B Free Float is zero",
        b &&
            Math.abs(b.freeFloat) < EPSILON,
        `B FF=${b?.freeFloat}`
    );

    check(
        "B is non-critical",
        b?.isCritical === false,
        `actual=${b?.isCritical}`
    );

    console.log("");
    console.log(
        `Free Float assertions: ${passed} passed, ${failed} failed`
    );

    console.log("\n=== FREE FLOAT DIAGNOSTIC ===");

    for (const id of ["A", "B", "C", "D"]) {
        const activity = result.activities[id];

        console.log(
            `${id} | ` +
            `TF=${activity?.totalFloat} | ` +
            `FF=${activity?.freeFloat} | ` +
            `Driving=${activity?.drivingFloat} | ` +
            `TF-FF=${activity ? activity.totalFloat - activity.freeFloat : "N/A"}`
        );
    }

    return result;
}

/**
 * Determines whether a relationship is driving the successor's
 * early schedule based on the already calculated ScheduleResult.
 *
 * Important:
 *
 * The Scheduler operates on working-calendar boundaries.
 *
 * For FS/SS relationships, the raw relationship boundary may fall
 * outside working time. For example:
 *
 * predecessor EF = Friday 16:00
 * successor ES   = Monday 08:00
 *
 * The relationship is still driving even though the timestamps
 * are different, because Monday 08:00 is the first valid working
 * start after the Friday finish.
 *
 * Therefore this helper must normalize FS/SS boundaries before
 * comparing them with the calculated successor early start.
 *
 * For FF/SF, the relationship constrains the successor finish.
 * The helper therefore evaluates the required finish boundary
 * against the calculated successor finish.
 */
function isRelationshipDriving(
    relationship,
    result
) {
    const predecessor =
        result.activities[
            relationship.predecessorId
        ];

    const successor =
        result.activities[
            relationship.successorId
        ];

    if (!predecessor || !successor) {
        return false;
    }

    const predecessorStart =
        predecessor.earlyStart;

    const predecessorFinish =
        predecessor.earlyFinish;

    const successorStart =
        successor.earlyStart;

    const successorFinish =
        successor.earlyFinish;

    if (
        !(predecessorStart instanceof Date) ||
        !(predecessorFinish instanceof Date) ||
        !(successorStart instanceof Date) ||
        !(successorFinish instanceof Date)
    ) {
        return false;
    }

    const type =
        String(
            relationship.type ?? "FS"
        )
            .trim()
            .toUpperCase();

    const lag =
        Number.isFinite(
            Number(relationship.lag)
        )
            ? Number(relationship.lag)
            : 0;

    const lagUnit =
        relationship.lagUnit === "hours"
            ? "hours"
            : "days";

    function applyTestLag(date) {
        if (lagUnit === "hours") {
            return addWorkingHours(
                calendar,
                date,
                lag
            );
        }

        return addWorkingDays(
            calendar,
            date,
            lag
        );
    }

    /*
     * FS / SS
     *
     * The relationship produces a required successor start.
     * The Scheduler then normalizes that candidate to a valid
     * working start.
     *
     * This normalization is essential when the predecessor
     * finishes at the end of a working day or before a weekend.
     */
    if (
        type === "FS" ||
        type === "SS"
    ) {
        const rawRequiredStart =
            type === "FS"
                ? applyTestLag(
                      predecessorFinish
                  )
                : applyTestLag(
                      predecessorStart
                  );

        if (
            !(rawRequiredStart instanceof Date) ||
            Number.isNaN(
                rawRequiredStart.getTime()
            )
        ) {
            return false;
        }

        const normalizedRequiredStart =
            startOfWorkingTime(
                calendar,
                rawRequiredStart,
                true
            );

        if (
            !(normalizedRequiredStart instanceof Date) ||
            Number.isNaN(
                normalizedRequiredStart.getTime()
            )
        ) {
            return false;
        }

        return (
            Math.abs(
                successorStart.getTime() -
                    normalizedRequiredStart.getTime()
            ) < 1000
        );
    }

    /*
     * FF / SF
     *
     * These relationships constrain the successor finish.
     * Unlike FS/SS, there is no start-time normalization
     * comparison here. The actual successor finish is compared
     * against the relationship finish boundary.
     */
    if (
        type === "FF" ||
        type === "SF"
    ) {
        const rawRequiredFinish =
            type === "FF"
                ? applyTestLag(
                      predecessorFinish
                  )
                : applyTestLag(
                      predecessorStart
                  );

        if (
            !(rawRequiredFinish instanceof Date) ||
            Number.isNaN(
                rawRequiredFinish.getTime()
            )
        ) {
            return false;
        }

        return (
            Math.abs(
                successorFinish.getTime() -
                    rawRequiredFinish.getTime()
            ) < 1000
        );
    }

    return false;
}

function printRelationshipAnalysis(
    relationships,
    result
) {
    console.log("\n=== RELATIONSHIP DRIVING ANALYSIS ===");

    console.log(
        "Predecessor -> Successor | Type | Lag | Driving | Boundary"
    );

    console.log(
        "-------------------------|------|-----|---------|---------"
    );

    for (const relationship of relationships) {
        const driving =
            isRelationshipDriving(
                relationship,
                result
            );

        let boundary;

        switch (relationship.type) {
            case "FS":
                boundary = "Finish -> Start";
                break;

            case "SS":
                boundary = "Start -> Start";
                break;

            case "FF":
                boundary = "Finish -> Finish";
                break;

            case "SF":
                boundary = "Start -> Finish";
                break;

            default:
                boundary = relationship.type;
                break;
        }

        console.log(
            `${relationship.predecessorId} -> ${relationship.successorId}`.padEnd(
                25
            ) +
                ` | ${relationship.type.padEnd(4)}` +
                ` | ${String(
                    relationship.lag ?? 0
                ).padEnd(3)}` +
                ` | ${String(driving).padEnd(
                    7
                )}` +
                ` | ${boundary}`
        );
    }
}

/**
 * Scenario 5B — Relationship Driving Analysis
 *
 * Purpose:
 * Validate driving at relationship level rather than trying
 * to infer it from Total Float / Driving Float equality.
 *
 * Network:
 *
 *               FS             FS
 *
 *           A ------> B ----------------> D
 *
 *           |         |
 *           |         |
 *         SS+1       FS
 *           |         |
 *           v         v
 *
 *           C -----------------------> E
 *
 *                      FS
 *
 * Effective controlling relationships:
 *
 * A -> B   FS  : driving
 * B -> C   FS  : driving
 * A -> C   SS+1: non-driving
 * B -> D   FS  : driving
 * C -> E   FS  : driving
 *
 * A -> C is deliberately non-driving because B -> C FS
 * requires C to start later than the SS+1 relationship
 * from A.
 */
function runRelationshipDrivingScenario() {
    const activities = [
        {
            id: "A",
            name: "Driving Root",
            duration: 2
        },
        {
            id: "B",
            name: "Main Driving Branch",
            duration: 4,
            predecessors: [
                {
                    predecessorId: "A",
                    successorId: "B",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "C",
            name: "Converging Activity",
            duration: 2,
            predecessors: [
                {
                    predecessorId: "A",
                    successorId: "C",
                    type: "SS",
                    lag: 1,
                    lagUnit: "days"
                },
                {
                    predecessorId: "B",
                    successorId: "C",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "D",
            name: "Main Terminal",
            duration: 1,
            predecessors: [
                {
                    predecessorId: "B",
                    successorId: "D",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        },
        {
            id: "E",
            name: "Converging Terminal",
            duration: 1,
            predecessors: [
                {
                    predecessorId: "C",
                    successorId: "E",
                    type: "FS",
                    lag: 0,
                    lagUnit: "days"
                }
            ]
        }
    ];

    const relationships = [
        {
            predecessorId: "A",
            successorId: "B",
            type: "FS",
            lag: 0,
            lagUnit: "days"
        },
        {
            predecessorId: "B",
            successorId: "C",
            type: "FS",
            lag: 0,
            lagUnit: "days"
        },
        {
            predecessorId: "A",
            successorId: "C",
            type: "SS",
            lag: 1,
            lagUnit: "days"
        },
        {
            predecessorId: "B",
            successorId: "D",
            type: "FS",
            lag: 0,
            lagUnit: "days"
        },
        {
            predecessorId: "C",
            successorId: "E",
            type: "FS",
            lag: 0,
            lagUnit: "days"
        }
    ];

    const result = scheduleProject(
        activities,
        {
            default: calendar
        },
        scheduleOptions
    );

    console.log("");
    console.log("============================================================");
    console.log("SCENARIO 5B — RELATIONSHIP DRIVING ANALYSIS");
    console.log("============================================================");

    printProject(result);

    console.log("\n=== ACTIVITIES ===");

    for (const id of ["A", "B", "C", "D", "E"]) {
        printActivity(result, id);
    }

    printCriticalPath(result);
    printWarnings(result);

    printRelationshipAnalysis(
        relationships,
        result
    );

    console.log("\n=== RELATIONSHIP ASSERTIONS ===");

    let passed = 0;
    let failed = 0;

    function check(name, condition, details) {
        const ok = Boolean(condition);

        console.log(
            `${ok ? "PASS" : "FAIL"} | ${name}` +
                (details ? ` | ${details}` : "")
        );

        if (ok) {
            passed += 1;
        } else {
            failed += 1;
        }
    }

    const drivingExpectations = [
        {
            name: "A -> B FS is driving",
            relationship: relationships[0],
            expected: true
        },
        {
            name: "B -> C FS is driving",
            relationship: relationships[1],
            expected: true
        },
        {
            name: "A -> C SS+1d is non-driving",
            relationship: relationships[2],
            expected: false
        },
        {
            name: "B -> D FS is driving",
            relationship: relationships[3],
            expected: true
        },
        {
            name: "C -> E FS is driving",
            relationship: relationships[4],
            expected: true
        }
    ];

    for (const item of drivingExpectations) {
        const actual =
            isRelationshipDriving(
                item.relationship,
                result
            );

        check(
            item.name,
            actual === item.expected,
            `expected=${item.expected}, actual=${actual}`
        );
    }

    console.log("\n=== ACTIVITY FLOAT SANITY ===");

    for (const id of ["A", "B", "C", "D", "E"]) {
        const activity =
            result.activities[id];

        check(
            `${id} Total Float finite`,
            activity &&
                Number.isFinite(
                    activity.totalFloat
                ),
            `TF=${activity?.totalFloat}`
        );

        check(
            `${id} Free Float finite`,
            activity &&
                Number.isFinite(
                    activity.freeFloat
                ),
            `FF=${activity?.freeFloat}`
        );

        check(
            `${id} Driving Float finite`,
            activity &&
                Number.isFinite(
                    activity.drivingFloat
                ),
            `Driving=${activity?.drivingFloat}`
        );

        check(
            `${id} Total Float non-negative`,
            activity &&
                activity.totalFloat >=
                    -EPSILON,
            `TF=${activity?.totalFloat}`
        );

        check(
            `${id} Free Float non-negative`,
            activity &&
                activity.freeFloat >=
                    -EPSILON,
            `FF=${activity?.freeFloat}`
        );

        check(
            `${id} Driving Float non-negative`,
            activity &&
                activity.drivingFloat >=
                    -EPSILON,
            `Driving=${activity?.drivingFloat}`
        );
    }

    const criticalActivities = [
        "A",
        "B",
        "C",
        "D",
        "E"
    ].filter(
        id =>
            result.activities[id]
                ?.isCritical === true
    );

    check(
        "At least one critical activity exists",
        criticalActivities.length > 0,
        `critical=${JSON.stringify(
            criticalActivities
        )}`
    );

    const criticalFloatViolations =
        criticalActivities.filter(
            id =>
                Math.abs(
                    result.activities[id]
                        .totalFloat
                ) > EPSILON
        );

    check(
        "Critical activities have zero Total Float",
        criticalFloatViolations.length === 0,
        `violations=${JSON.stringify(
            criticalFloatViolations
        )}`
    );

    check(
        "Critical path exists",
        Array.isArray(
            result.criticalPath
        ) &&
            result.criticalPath.length > 0,
        `path=${JSON.stringify(
            result.criticalPath
        )}`
    );

    check(
        "Project finish exists",
        result.projectFinish instanceof Date &&
            !Number.isNaN(
                result.projectFinish.getTime()
            ),
        `finish=${result.projectFinish?.toISOString()}`
    );

    console.log("");
    console.log(
        `Scenario 5B assertions: ${passed} passed, ${failed} failed`
    );

    return result;
}

console.log("");
console.log("============================================================");
console.log("PCS CPM REGRESSION");
console.log("============================================================");

console.log("Node   :", process.version);
console.log("Started:", new Date().toISOString());

runMixedRelationshipScenario();

runFloatScenario();

runFloatStressScenario();

runFreeFloatStressScenario();

runRelationshipDrivingScenario();

console.log("");
console.log("============================================================");
console.log("REGRESSION RUN COMPLETE");
console.log("============================================================");