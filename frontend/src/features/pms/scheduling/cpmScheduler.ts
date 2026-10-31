import type {
    ConstraintType,
    ScheduleActivity,
    ScheduleCalendar,
    ScheduleOptions,
    ScheduleRelationship,
    ScheduleResult,
    ScheduledActivity
} from "./scheduleTypes";

import {
    addWorkingDays,
    addWorkingHours,
    calculateWorkingDuration,
    endOfWorkingTime,
    getLastWorkingIntervalEnd,
    getDefaultCalendar,
    nextWorkingDay,
    previousWorkingDay,
    startOfWorkingTime,
    subtractWorkingDays,
    subtractWorkingHours,
    toDate,
    workingDaysBetween,
    workingHoursBetween
} from "./calendarEngine";

import {
    getActivityRelationships,
    normalizeLagUnit,
    normalizeRelationshipType
} from "./relationshipEngine";

const EPSILON = 0.000001;
const DEFAULT_MAX_ITERATIONS = 10000;

interface InternalSchedule extends ScheduledActivity {
    durationDays: number;
    durationHours: number;
    calendar: ScheduleCalendar;
}

interface GraphEdge {
    relationship: ScheduleRelationship;
    predecessorId: string;
    successorId: string;
}

function finite(
    value: unknown,
    fallback = 0
): number {
    const numeric = Number(value);

    return Number.isFinite(numeric)
        ? numeric
        : fallback;
}

function isMilestone(
    activity: ScheduleActivity
): boolean {
    return Boolean(
        activity.isMilestone ||
            activity.activityType === "StartMilestone" ||
            activity.activityType === "FinishMilestone"
    );
}

function durationOf(
    activity: ScheduleActivity,
    calendar: ScheduleCalendar,
    options: ScheduleOptions
): number {
    if (isMilestone(activity)) {
        return 0;
    }

    const explicitDuration =
        Number(activity.duration);

    if (
        Number.isFinite(explicitDuration) &&
        explicitDuration >= 0
    ) {
        return Math.max(
            0,
            explicitDuration
        );
    }

    if (
        options.deriveDurationFromDates !== false
    ) {
        const derived =
            calculateWorkingDuration(
                calendar,
                activity.start,
                activity.finish
            );

        if (derived > EPSILON) {
            return derived;
        }

        const plannedDerived =
            calculateWorkingDuration(
                calendar,
                activity.plannedStart,
                activity.plannedFinish
            );

        if (plannedDerived > EPSILON) {
            return plannedDerived;
        }
    }

    return Math.max(
        0,
        finite(
            options.defaultDuration,
            0
        )
    );
}

function durationHoursOf(
    calendar: ScheduleCalendar,
    durationDays: number
): number {
    return Math.max(
        0,
        durationDays *
            Math.max(
                0,
                calendar.hoursPerDay || 0
            )
    );
}

function addDuration(
    calendar: ScheduleCalendar,
    start: Date,
    days: number
): Date {
    if (days <= EPSILON) {
        return new Date(
            start.getTime()
        );
    }

    return addWorkingDays(
        calendar,
        start,
        days
    );
}

function subtractDuration(
    calendar: ScheduleCalendar,
    finish: Date,
    days: number
): Date {
    if (days <= EPSILON) {
        return new Date(
            finish.getTime()
        );
    }

    return subtractWorkingDays(
        calendar,
        finish,
        days
    );
}

function shiftWorkingDays(
    calendar: ScheduleCalendar,
    date: Date,
    days: number
): Date {
    if (!Number.isFinite(days) || Math.abs(days) <= EPSILON) {
        return new Date(date.getTime());
    }

    const direction = Math.sign(days);
    const wholeDays = Math.floor(Math.abs(days));
    let result = new Date(date.getTime());

    for (let index = 0; index < wholeDays; index += 1) {
        result =
            direction > 0
                ? nextWorkingDay(calendar, result, false)
                : previousWorkingDay(calendar, result, false);

        result.setHours(
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        );

        result = normalizeStart(calendar, result);
    }

    const fractionalDay = Math.abs(days) - wholeDays;
    const fractionalHours =
        fractionalDay * Math.max(0, calendar.hoursPerDay || 0);

    if (fractionalHours > EPSILON) {
        result =
            direction > 0
                ? addWorkingHours(calendar, result, fractionalHours)
                : subtractWorkingHours(calendar, result, fractionalHours);
    }

    return result;
}

function addLag(
    calendar: ScheduleCalendar,
    date: Date,
    lag: number,
    unit: "days" | "hours"
): Date {
    if (
        !Number.isFinite(lag) ||
        Math.abs(lag) <= EPSILON
    ) {
        return new Date(
            date.getTime()
        );
    }

    return unit === "hours"
        ? addWorkingHours(
              calendar,
              date,
              lag
          )
        : shiftWorkingDays(
              calendar,
              date,
              lag
          );
}

function subtractLag(
    calendar: ScheduleCalendar,
    date: Date,
    lag: number,
    unit: "days" | "hours"
): Date {
    if (
        !Number.isFinite(lag) ||
        Math.abs(lag) <= EPSILON
    ) {
        return new Date(
            date.getTime()
        );
    }

    return unit === "hours"
        ? subtractWorkingHours(
              calendar,
              date,
              lag
          )
        : shiftWorkingDays(
              calendar,
              date,
              -lag
          );
}

function normalizeConstraintType(
    value:
        | string
        | null
        | undefined
): ConstraintType {
    const normalized =
        String(value ?? "")
            .trim()
            .replace(
                /\s+/g,
                ""
            )
            .toLowerCase();

    const map: Record<
        string,
        ConstraintType
    > = {
        none: "None",
        starton: "StartOn",
        startonorafter: "StartOnOrAfter",
        startonorbefore: "StartOnOrBefore",
        finishon: "FinishOn",
        finishonorafter: "FinishOnOrAfter",
        finishonorbefore: "FinishOnOrBefore",
        mandatorystart: "MandatoryStart",
        mandatoryfinish: "MandatoryFinish",
        aslateaspossible: "AsLateAsPossible"
    };

    return (
        map[normalized] ??
        "None"
    );
}

function getCalendar(
    activity: ScheduleActivity,
    calendars: Record<
        string,
        ScheduleCalendar
    >,
    defaultCalendarId?: string
): ScheduleCalendar {
    const id =
        activity.calendarId ||
        defaultCalendarId ||
        "standard";

    return (
        calendars[id] ??
        calendars.standard ??
        getDefaultCalendar()
    );
}

function getProjectCalendar(
    calendars: Record<
        string,
        ScheduleCalendar
    >,
    defaultCalendarId?: string
): ScheduleCalendar {
    if (
        defaultCalendarId &&
        calendars[defaultCalendarId]
    ) {
        return calendars[
            defaultCalendarId
        ];
    }

    if (calendars.standard) {
        return calendars.standard;
    }

    return getDefaultCalendar();
}

function normalizeStart(
    calendar: ScheduleCalendar,
    date: Date
): Date {
    const endBoundary = endOfWorkingTime(
        calendar,
        date
    );

    if (endBoundary.getTime() === date.getTime()) {
        return new Date(date.getTime());
    }

    return startOfWorkingTime(
        calendar,
        date,
        true
    );
}

function minDate(
    values: Array<
        Date | null | undefined
    >
): Date | null {
    const valid =
        values.filter(
            (
                value
            ): value is Date =>
                value instanceof Date &&
                Number.isFinite(
                    value.getTime()
                )
        );

    if (!valid.length) {
        return null;
    }

    return valid.reduce(
        (min, value) =>
            value.getTime() <
            min.getTime()
                ? value
                : min
    );
}

function maxDate(
    values: Array<
        Date | null | undefined
    >
): Date | null {
    const valid =
        values.filter(
            (
                value
            ): value is Date =>
                value instanceof Date &&
                Number.isFinite(
                    value.getTime()
                )
        );

    if (!valid.length) {
        return null;
    }

    return valid.reduce(
        (max, value) =>
            value.getTime() >
            max.getTime()
                ? value
                : max
    );
}

function buildEdges(
    activities: ScheduleActivity[]
): GraphEdge[] {
    const ids =
        new Set(
            activities.map(
                activity =>
                    activity.id
            )
        );

    const edges: GraphEdge[] = [];

    for (const activity of activities) {
        for (const relation of getActivityRelationships(
            activity
        )) {
            const predecessorId =
                relation.predecessorId;

            const successorId =
                relation.successorId ||
                activity.id;

            if (
                !ids.has(predecessorId) ||
                !ids.has(successorId)
            ) {
                continue;
            }

            if (
                predecessorId ===
                successorId
            ) {
                continue;
            }

            edges.push({
                relationship: relation,
                predecessorId,
                successorId
            });
        }
    }

    return edges;
}

function topologicalOrder(
    activities: ScheduleActivity[],
    edges: GraphEdge[],
    warnings: string[]
): string[] {
    const indegree =
        new Map<
            string,
            number
        >();

    const outgoing =
        new Map<
            string,
            string[]
        >();

    for (const activity of activities) {
        indegree.set(
            activity.id,
            0
        );

        outgoing.set(
            activity.id,
            []
        );
    }

    for (const edge of edges) {
        indegree.set(
            edge.successorId,
            (
                indegree.get(
                    edge.successorId
                ) ?? 0
            ) + 1
        );

        outgoing
            .get(
                edge.predecessorId
            )
            ?.push(
                edge.successorId
            );
    }

    const queue =
        activities
            .filter(
                activity =>
                    (
                        indegree.get(
                            activity.id
                        ) ?? 0
                    ) === 0
            )
            .map(
                activity =>
                    activity.id
            );

    const result: string[] = [];

    while (queue.length) {
        const id = queue.shift();

        if (!id) {
            continue;
        }

        result.push(id);

        for (const successorId of
            outgoing.get(id) ?? []) {
            const next =
                (
                    indegree.get(
                        successorId
                    ) ?? 0
                ) - 1;

            indegree.set(
                successorId,
                next
            );

            if (next === 0) {
                queue.push(
                    successorId
                );
            }
        }
    }

    if (
        result.length !==
        activities.length
    ) {
        warnings.push(
            "Circular relationship detected. The unresolved activities were kept in input order; CPM results for that cycle are not reliable."
        );

        for (const activity of activities) {
            if (
                !result.includes(
                    activity.id
                )
            ) {
                result.push(
                    activity.id
                );
            }
        }
    }

    return result;
}

function getInitialStart(
    activity: ScheduleActivity,
    calendar: ScheduleCalendar,
    options: ScheduleOptions
): Date | null {
    const projectStart =
        toDate(
            options.projectStart
        );

    const explicitStart =
        toDate(
            activity.start
        );

    const plannedStart =
        toDate(
            activity.plannedStart
        );

    const dataDate =
        toDate(
            options.dataDate
        );

    const candidate =
        explicitStart ??
        projectStart ??
        dataDate ??
        plannedStart;

    if (!candidate) {
        return null;
    }

    return normalizeStart(
        calendar,
        candidate
    );
}

/**
 * Returns the earliest working start whose calculated
 * finish is on or after the required finish boundary.
 *
 * This is required for FF/SF relationships because a raw
 * backward subtraction can cross a non-working boundary
 * and produce a start whose resulting finish is still
 * before the required boundary.
 */
function earliestStartForFinishAtLeast(
    calendar: ScheduleCalendar,
    requiredFinish: Date,
    durationDays: number
): Date {
    const duration =
        Math.max(
            0,
            finite(
                durationDays,
                0
            )
        );

    if (duration <= EPSILON) {
        return normalizeStart(
            calendar,
            requiredFinish
        );
    }

    let candidate =
        normalizeStart(
            calendar,
            subtractDuration(
                calendar,
                requiredFinish,
                duration
            )
        );

    let candidateFinish =
        addDuration(
            calendar,
            candidate,
            duration
        );

    if (
        candidateFinish.getTime() <
        requiredFinish.getTime()
    ) {
        candidate =
            normalizeStart(
                calendar,
                requiredFinish
            );

        candidateFinish =
            addDuration(
                calendar,
                candidate,
                duration
            );
    }

    /*
     * A task may start at the previous working interval's finish
     * boundary. Check earlier boundaries so FF/SF constraints select
     * the earliest feasible start, not merely the result of subtracting
     * working hours from the required finish.
     */
    for (let index = 0; index < 10000; index += 1) {
        const previousDay =
            previousWorkingDay(
                calendar,
                candidate,
                false
            );

        const previousEnd =
            getLastWorkingIntervalEnd(
                calendar,
                previousDay
            );

        if (
            !previousEnd ||
            previousEnd.getTime() >= candidate.getTime()
        ) {
            break;
        }

        const previousFinish =
            addDuration(
                calendar,
                previousEnd,
                duration
            );

        if (
            previousFinish.getTime() <
            requiredFinish.getTime()
        ) {
            break;
        }

        candidate = previousEnd;
    }

    return candidate;
}

function forwardStartCandidate(
    edge: GraphEdge,
    predecessor: InternalSchedule,
    successorCalendar: ScheduleCalendar,
    successorDuration: number
): Date | null {
    if (
        !predecessor.earlyStart ||
        !predecessor.earlyFinish
    ) {
        return null;
    }

    const type =
        normalizeRelationshipType(
            edge.relationship.type
        );

    const lag =
        finite(
            edge.relationship.lag,
            0
        );

    const unit =
        normalizeLagUnit(
            edge.relationship
        );

    switch (type) {
        case "FS":
            return addLag(
                successorCalendar,
                predecessor.earlyFinish,
                lag,
                unit
            );

        case "SS":
            return addLag(
                successorCalendar,
                predecessor.earlyStart,
                lag,
                unit
            );

        case "FF": {
            const requiredFinish =
                addLag(
                    successorCalendar,
                    predecessor.earlyFinish,
                    lag,
                    unit
                );

            return earliestStartForFinishAtLeast(
                successorCalendar,
                requiredFinish,
                successorDuration
            );
        }

        case "SF": {
            /*
             * SF:
             *
             * Successor Finish must be >=
             * Predecessor Start + Lag.
             *
             * We calculate a feasible successor start
             * from the required finish boundary instead
             * of assuming that subtractDuration() is
             * always the inverse of addDuration() around
             * weekends/holidays.
             */
            const requiredFinish =
                addLag(
                    successorCalendar,
                    predecessor.earlyStart,
                    lag,
                    unit
                );

            return earliestStartForFinishAtLeast(
                successorCalendar,
                requiredFinish,
                successorDuration
            );
        }

        default:
            return null;
    }
}

function applyForwardConstraints(
    activity: ScheduleActivity,
    calendar: ScheduleCalendar,
    start: Date,
    finish: Date,
    durationDays: number,
    warnings: string[]
): {
    start: Date;
    finish: Date;
} {
    const constraint =
        normalizeConstraintType(
            activity.constraintType
        );

    const rawDate =
        toDate(
            activity.constraintDate
        );

    const duration =
        Math.max(
            0,
            finite(
                durationDays,
                0
            )
        );

    if (
        !rawDate ||
        constraint === "None" ||
        constraint === "AsLateAsPossible"
    ) {
        return {
            start,
            finish
        };
    }

    const date =
        normalizeStart(
            calendar,
            rawDate
        );

    switch (constraint) {
        case "StartOn":
        case "MandatoryStart":
            return {
                start: date,
                finish:
                    addDuration(
                        calendar,
                        date,
                        duration
                    )
            };

        case "StartOnOrAfter":
            if (
                start.getTime() <
                date.getTime()
            ) {
                start = date;

                finish =
                    addDuration(
                        calendar,
                        start,
                        duration
                    );
            }

            return {
                start,
                finish
            };

        case "StartOnOrBefore":
            if (
                start.getTime() >
                date.getTime()
            ) {
                warnings.push(
                    `${activity.code ?? activity.id}: Start On or Before constraint is violated by the calculated early start.`
                );
            }

            return {
                start,
                finish
            };

        case "FinishOn":
        case "MandatoryFinish":
            return {
                start:
                    subtractDuration(
                        calendar,
                        date,
                        duration
                    ),
                finish: date
            };

        case "FinishOnOrAfter":
            if (
                finish.getTime() <
                date.getTime()
            ) {
                finish = date;

                start =
                    subtractDuration(
                        calendar,
                        finish,
                        duration
                    );
            }

            return {
                start,
                finish
            };

        case "FinishOnOrBefore":
            if (
                finish.getTime() >
                date.getTime()
            ) {
                warnings.push(
                    `${activity.code ?? activity.id}: Finish On or Before constraint is violated by the calculated early finish.`
                );
            }

            return {
                start,
                finish
            };

        default:
            return {
                start,
                finish
            };
    }
}

function backwardFinishCandidate(
    edge: GraphEdge,
    successor: InternalSchedule,
    predecessorCalendar: ScheduleCalendar,
    predecessorDuration: number
): Date | null {
    if (
        !successor.lateStart ||
        !successor.lateFinish
    ) {
        return null;
    }

    const type =
        normalizeRelationshipType(
            edge.relationship.type
        );

    const lag =
        finite(
            edge.relationship.lag,
            0
        );

    const unit =
        normalizeLagUnit(
            edge.relationship
        );

    if (type === "FS") {
        return subtractLag(
            predecessorCalendar,
            successor.lateStart,
            lag,
            unit
        );
    }

    if (type === "SS") {
        const requiredStart =
            subtractLag(
                predecessorCalendar,
                successor.lateStart,
                lag,
                unit
            );

        return addDuration(
            predecessorCalendar,
            requiredStart,
            predecessorDuration
        );
    }

    if (type === "FF") {
        return subtractLag(
            predecessorCalendar,
            successor.lateFinish,
            lag,
            unit
        );
    }

    const requiredStart =
        subtractLag(
            predecessorCalendar,
            successor.lateFinish,
            lag,
            unit
        );

    return addDuration(
        predecessorCalendar,
        requiredStart,
        predecessorDuration
    );
}

function applyBackwardConstraints(
    activity: ScheduleActivity,
    calendar: ScheduleCalendar,
    lateStart: Date,
    lateFinish: Date,
    durationDays: number
): {
    lateStart: Date;
    lateFinish: Date;
} {
    const constraint =
        normalizeConstraintType(
            activity.constraintType
        );

    const rawDate =
        toDate(
            activity.constraintDate
        );

    const duration =
        Math.max(
            0,
            finite(
                durationDays,
                0
            )
        );

    if (
        !rawDate ||
        constraint === "None" ||
        constraint === "AsLateAsPossible"
    ) {
        return {
            lateStart,
            lateFinish
        };
    }

    const date =
        normalizeStart(
            calendar,
            rawDate
        );

    switch (constraint) {
        case "StartOn":
        case "MandatoryStart":
            return {
                lateStart: date,
                lateFinish:
                    addDuration(
                        calendar,
                        date,
                        duration
                    )
            };

        case "StartOnOrAfter":
            if (
                lateStart.getTime() <
                date.getTime()
            ) {
                return {
                    lateStart: date,
                    lateFinish:
                        addDuration(
                            calendar,
                            date,
                            duration
                        )
                };
            }

            return {
                lateStart,
                lateFinish
            };

        case "StartOnOrBefore":
            if (
                lateStart.getTime() >
                date.getTime()
            ) {
                return {
                    lateStart: date,
                    lateFinish:
                        addDuration(
                            calendar,
                            date,
                            duration
                        )
                };
            }

            return {
                lateStart,
                lateFinish
            };

        case "FinishOn":
        case "MandatoryFinish":
            return {
                lateStart:
                    subtractDuration(
                        calendar,
                        date,
                        duration
                    ),
                lateFinish: date
            };

        case "FinishOnOrAfter":
            if (
                lateFinish.getTime() <
                date.getTime()
            ) {
                return {
                    lateStart:
                        subtractDuration(
                            calendar,
                            date,
                            duration
                        ),
                    lateFinish: date
                };
            }

            return {
                lateStart,
                lateFinish
            };

        case "FinishOnOrBefore":
            if (
                lateFinish.getTime() >
                date.getTime()
            ) {
                return {
                    lateStart:
                        subtractDuration(
                            calendar,
                            date,
                            duration
                        ),
                    lateFinish: date
                };
            }

            return {
                lateStart,
                lateFinish
            };

        default:
            return {
                lateStart,
                lateFinish
            };
    }
}

function calculateFreeFloat(
    activityId: string,
    edges: GraphEdge[],
    schedules: Map<
        string,
        InternalSchedule
    >
): number {
    const current =
        schedules.get(
            activityId
        );

    if (
        !current?.earlyStart ||
        !current?.earlyFinish
    ) {
        return 0;
    }

    const outgoing =
        edges.filter(
            edge =>
                edge.predecessorId ===
                activityId
        );

    if (!outgoing.length) {
        return current.totalFloat;
    }

    const candidates: number[] = [];

    for (const edge of outgoing) {
        const successor =
            schedules.get(
                edge.successorId
            );

        if (
            !successor?.earlyStart ||
            !successor.earlyFinish
        ) {
            continue;
        }

        const type =
            normalizeRelationshipType(
                edge.relationship.type
            );

        const lag =
            finite(
                edge.relationship.lag,
                0
            );

        const unit =
            normalizeLagUnit(
                edge.relationship
            );

        if (type === "FS") {
            const allowed =
                subtractLag(
                    current.calendar,
                    successor.earlyStart,
                    lag,
                    unit
                );

            candidates.push(
                workingDaysBetween(
                    current.calendar,
                    current.earlyFinish,
                    allowed
                )
            );

            continue;
        }

        if (type === "FF") {
            const allowed =
                subtractLag(
                    current.calendar,
                    successor.earlyFinish,
                    lag,
                    unit
                );

            candidates.push(
                workingDaysBetween(
                    current.calendar,
                    current.earlyFinish,
                    allowed
                )
            );

            continue;
        }

        if (type === "SS") {
            const allowed =
                subtractLag(
                    current.calendar,
                    successor.earlyStart,
                    lag,
                    unit
                );

            candidates.push(
                workingDaysBetween(
                    current.calendar,
                    current.earlyStart,
                    allowed
                )
            );

            continue;
        }

        const allowed =
            subtractLag(
                current.calendar,
                successor.earlyFinish,
                lag,
                unit
            );

        candidates.push(
            workingDaysBetween(
                current.calendar,
                current.earlyStart,
                allowed
            )
        );
    }

    return candidates.length
        ? Math.min(
              ...candidates
          )
        : current.totalFloat;
}

function getTerminalActivities(
    activities: ScheduleActivity[],
    edges: GraphEdge[]
): ScheduleActivity[] {
    const predecessors =
        new Set(
            edges.map(
                edge =>
                    edge.predecessorId
            )
        );

    return activities.filter(
        activity =>
            !predecessors.has(
                activity.id
            )
    );
}

function datesEqual(
    left: Date | null | undefined,
    right: Date | null | undefined
): boolean {
    if (!left || !right) {
        return false;
    }

    return Math.abs(
        left.getTime() -
            right.getTime()
    ) <= EPSILON * 1000;
}

function normalizeRelationshipCandidate(
    edge: GraphEdge,
    candidate: Date,
    successorCalendar: ScheduleCalendar
): Date {
    const type =
        normalizeRelationshipType(
            edge.relationship.type
        );

    if (
        type === "FS" ||
        type === "SS"
    ) {
        return normalizeStart(
            successorCalendar,
            candidate
        );
    }

    return candidate;
}

function isDrivingRelationship(
    edge: GraphEdge,
    schedules: Map<
        string,
        InternalSchedule
    >
): boolean {
    const predecessor =
        schedules.get(
            edge.predecessorId
        );

    const successor =
        schedules.get(
            edge.successorId
        );

    if (
        !predecessor ||
        !successor ||
        !successor.earlyStart ||
        !successor.earlyFinish
    ) {
        return false;
    }

    const candidate =
        forwardStartCandidate(
            edge,
            predecessor,
            successor.calendar,
            successor.durationDays
        );

    if (!candidate) {
        return false;
    }

    const normalized =
        normalizeRelationshipCandidate(
            edge,
            candidate,
            successor.calendar
        );

    if (
        datesEqual(
            normalized,
            successor.earlyStart
        )
    ) {
        return true;
    }

    const candidateStart =
        normalizeStart(
            successor.calendar,
            candidate
        );

    const candidateFinish =
        addDuration(
            successor.calendar,
            candidateStart,
            successor.durationDays
        );

    const type =
        normalizeRelationshipType(
            edge.relationship.type
        );

    if (
        type === "FF" ||
        type === "SF"
    ) {
        return datesEqual(
            candidateFinish,
            successor.earlyFinish
        );
    }

    return false;
}

function selectCriticalPath(
    activities: ScheduleActivity[],
    edges: GraphEdge[],
    order: string[],
    schedules: Map<
        string,
        InternalSchedule
    >
): string[] {
    const criticalIds =
        new Set(
            activities
                .filter(
                    activity =>
                        schedules.get(
                            activity.id
                        )?.isCritical
                )
                .map(
                    activity =>
                        activity.id
                )
        );

    if (!criticalIds.size) {
        return [];
    }

    const orderIndex =
        new Map(
            order.map(
                (id, index) => [
                    id,
                    index
                ]
            )
        );

    const incoming =
        new Map<
            string,
            GraphEdge[]
        >();

    for (const edge of edges) {
        const list =
            incoming.get(
                edge.successorId
            ) ?? [];

        list.push(edge);

        incoming.set(
            edge.successorId,
            list
        );
    }

    const memo =
        new Map<
            string,
            string[]
        >();

    const visiting =
        new Set<string>();

    const buildChain = (
        id: string
    ): string[] => {
        const cached =
            memo.get(id);

        if (cached) {
            return cached;
        }

        if (visiting.has(id)) {
            return [id];
        }

        visiting.add(id);

        const candidates =
            (
                incoming.get(id) ??
                []
            )
                .filter(
                    edge =>
                        criticalIds.has(
                            edge.predecessorId
                        ) &&
                        isDrivingRelationship(
                            edge,
                            schedules
                        )
                )
                .map(
                    edge =>
                        edge.predecessorId
                )
                .sort(
                    (a, b) =>
                        (
                            orderIndex.get(
                                a
                            ) ??
                            Number.MAX_SAFE_INTEGER
                        ) -
                        (
                            orderIndex.get(
                                b
                            ) ??
                            Number.MAX_SAFE_INTEGER
                        )
                );

        let best: string[] = [];

        for (const predecessorId of candidates) {
            const chain =
                buildChain(
                    predecessorId
                );

            if (
                chain.length >
                best.length
            ) {
                best = chain;
            }
        }

        visiting.delete(id);

        const result = [
            ...best,
            id
        ];

        memo.set(
            id,
            result
        );

        return result;
    };

    const terminalCriticalIds =
        activities
            .filter(
                activity =>
                    criticalIds.has(
                        activity.id
                    ) &&
                    !edges.some(
                        edge =>
                            edge.predecessorId ===
                                activity.id &&
                            criticalIds.has(
                                edge.successorId
                            ) &&
                            isDrivingRelationship(
                                edge,
                                schedules
                            )
                    )
            )
            .map(
                activity =>
                    activity.id
            )
            .sort(
                (a, b) =>
                    (
                        orderIndex.get(
                            a
                        ) ??
                        Number.MAX_SAFE_INTEGER
                    ) -
                    (
                        orderIndex.get(
                            b
                        ) ??
                        Number.MAX_SAFE_INTEGER
                    )
            );

    let bestPath: string[] = [];

    for (const terminalId of terminalCriticalIds) {
        const path =
            buildChain(
                terminalId
            );

        if (
            path.length >
            bestPath.length
        ) {
            bestPath = path;
        }
    }

    if (!bestPath.length) {
        const firstCritical =
            order.find(
                id =>
                    criticalIds.has(
                        id
                    )
            );

        return firstCritical
            ? [firstCritical]
            : [];
    }

    return bestPath;
}

export function scheduleProject(
    activities: ScheduleActivity[],
    calendars: Record<
        string,
        ScheduleCalendar
    > = {},
    options: ScheduleOptions = {}
): ScheduleResult {
    const warnings: string[] = [];

    if (!activities.length) {
        return {
            activities: {},
            projectStart: null,
            projectFinish: null,
            projectDuration: 0,
            projectDurationHours: 0,
            criticalPath: [],
            warnings
        };
    }

    const calendarMap =
        Object.keys(calendars).length
            ? calendars
            : {
                  standard:
                      getDefaultCalendar()
              };

    const activityMap =
        new Map(
            activities.map(
                activity => [
                    activity.id,
                    activity
                ]
            )
        );

    const edges =
        buildEdges(
            activities
        );

    const order =
        topologicalOrder(
            activities,
            edges,
            warnings
        );

    const schedules =
        new Map<
            string,
            InternalSchedule
        >();

    // ------------------------------------------------------------
    // Duration Establishment
    // ------------------------------------------------------------

    for (const activity of activities) {
        const calendar =
            getCalendar(
                activity,
                calendarMap,
                options.defaultCalendarId
            );

        const durationDays =
            durationOf(
                activity,
                calendar,
                options
            );

        const durationHours =
            durationHoursOf(
                calendar,
                durationDays
            );

        schedules.set(
            activity.id,
            {
                id: activity.id,

                earlyStart: null,
                earlyFinish: null,

                lateStart: null,
                lateFinish: null,

                duration:
                    durationDays,

                durationHours:
                    durationHours,

                totalFloat: 0,
                freeFloat: 0,
                drivingFloat: 0,

                isCritical: false,

                durationDays,
                calendar
            }
        );
    }

    // ------------------------------------------------------------
    // Forward Pass
    // ------------------------------------------------------------

    for (const id of order) {
        const activity =
            activityMap.get(id);

        const current =
            schedules.get(id);

        if (
            !activity ||
            !current
        ) {
            continue;
        }

        const startCandidates: Date[] = [];

        const initial =
            getInitialStart(
                activity,
                current.calendar,
                options
            );

        if (initial) {
            startCandidates.push(
                initial
            );
        }

        for (const edge of edges) {
            if (
                edge.successorId !==
                id
            ) {
                continue;
            }

            const predecessor =
                schedules.get(
                    edge.predecessorId
                );

            if (!predecessor) {
                continue;
            }

            const candidate =
                forwardStartCandidate(
                    edge,
                    predecessor,
                    current.calendar,
                    current.durationDays
                );

            if (candidate) {
                startCandidates.push(
                    candidate
                );
            }
        }

        let earlyStart =
            maxDate(
                startCandidates
            );

        if (!earlyStart) {
            warnings.push(
                `${activity.code ?? activity.id}: No valid scheduling start anchor was found.`
            );

            continue;
        }

        earlyStart =
            normalizeStart(
                current.calendar,
                earlyStart
            );

        const earlyFinish =
            addDuration(
                current.calendar,
                earlyStart,
                current.durationDays
            );

        const constrained =
            applyForwardConstraints(
                activity,
                current.calendar,
                earlyStart,
                earlyFinish,
                current.durationDays,
                warnings
            );

        current.earlyStart =
            constrained.start;

        current.earlyFinish =
            constrained.finish;
    }

    // ------------------------------------------------------------
    // Project Calendar / Project Horizon
    // ------------------------------------------------------------

    const projectCalendar =
        getProjectCalendar(
            calendarMap,
            options.defaultCalendarId
        );

    let projectStart =
        minDate(
            [...schedules.values()]
                .map(
                    item =>
                        item.earlyStart
                )
        );

    const networkFinish =
        maxDate(
            [...schedules.values()]
                .map(
                    item =>
                        item.earlyFinish
                )
        );

    let projectFinish: Date | null;

    const requestedStart =
        toDate(
            options.projectStart
        );

    const requestedFinish =
        toDate(
            options.projectFinish
        );

    if (requestedStart) {
        const normalized =
            normalizeStart(
                projectCalendar,
                requestedStart
            );

        projectStart =
            projectStart
                ? minDate([
                      projectStart,
                      normalized
                  ])
                : normalized;
    }

    const terminal =
        getTerminalActivities(
            activities,
            edges
        );

    const terminalFinish =
        maxDate(
            terminal.map(
                activity =>
                    schedules.get(
                        activity.id
                    )?.earlyFinish
            )
        );

    if (!requestedFinish) {
        projectFinish =
            terminalFinish ??
            networkFinish;
    } else {
        projectFinish =
            requestedFinish;
    }

    // ------------------------------------------------------------
    // Backward Pass
    // ------------------------------------------------------------

    const backwardOrder =
        [...order].reverse();

    for (const id of backwardOrder) {
        const activity =
            activityMap.get(id);

        const current =
            schedules.get(id);

        if (
            !activity ||
            !current
        ) {
            continue;
        }

        const finishCandidates: Date[] = [];

        const outgoing =
            edges.filter(
                edge =>
                    edge.predecessorId ===
                    id
            );

        if (
            !outgoing.length &&
            projectFinish
        ) {
            finishCandidates.push(
                projectFinish
            );
        }

        for (const edge of outgoing) {
            const successor =
                schedules.get(
                    edge.successorId
                );

            if (!successor) {
                continue;
            }

            const candidate =
                backwardFinishCandidate(
                    edge,
                    successor,
                    current.calendar,
                    current.durationDays
                );

            if (candidate) {
                finishCandidates.push(
                    candidate
                );
            }
        }

        let lateFinish =
            minDate(
                finishCandidates
            );

        if (!lateFinish) {
            lateFinish =
                current.earlyFinish;
        }

        if (!lateFinish) {
            continue;
        }

        const lateStart =
            subtractDuration(
                current.calendar,
                lateFinish,
                current.durationDays
            );

        const constrained =
            applyBackwardConstraints(
                activity,
                current.calendar,
                lateStart,
                lateFinish,
                current.durationDays
            );

        current.lateStart =
            constrained.lateStart;

        current.lateFinish =
            constrained.lateFinish;
    }

    // ------------------------------------------------------------
    // Float + Critical Activities
    // ------------------------------------------------------------

    const threshold =
        Math.max(
            0,
            finite(
                options.criticalFloatThreshold,
                0
            )
        );

    const resultActivities:
        Record<
            string,
            ScheduledActivity
        > = {};

    for (const activity of activities) {
        const current =
            schedules.get(
                activity.id
            );

        if (!current) {
            continue;
        }

        const totalFloat =
            current.earlyStart &&
            current.lateStart
                ? workingDaysBetween(
                      current.calendar,
                      current.earlyStart,
                      current.lateStart
                  )
                : 0;

        current.totalFloat =
            totalFloat;

        const freeFloat =
            calculateFreeFloat(
                activity.id,
                edges,
                schedules
            );

        current.freeFloat =
            freeFloat;

        current.drivingFloat =
            Math.min(
                current.totalFloat,
                current.freeFloat
            );

        current.isCritical =
            current.totalFloat <=
            threshold + EPSILON;

        resultActivities[
            activity.id
        ] = {
            id: activity.id,

            earlyStart:
                current.earlyStart,

            earlyFinish:
                current.earlyFinish,

            lateStart:
                current.lateStart,

            lateFinish:
                current.lateFinish,

            duration:
                current.durationDays,

            durationHours:
                current.durationHours,

            totalFloat:
                current.totalFloat,

            freeFloat:
                current.freeFloat,

            drivingFloat:
                current.drivingFloat,

            isCritical:
                current.isCritical
        };
    }

    // ------------------------------------------------------------
    // Driving Critical Path
    // ------------------------------------------------------------

    const criticalPath =
        selectCriticalPath(
            activities,
            edges,
            order,
            schedules
        );

    // ------------------------------------------------------------
    // Project Duration
    // ------------------------------------------------------------

    const projectDurationHours =
        projectStart &&
        projectFinish
            ? Math.max(
                  0,
                  workingHoursBetween(
                      projectCalendar,
                      projectStart,
                      projectFinish
                  )
              )
            : 0;

    const projectDuration =
        projectStart &&
        projectFinish
            ? Math.max(
                  0,
                  workingDaysBetween(
                      projectCalendar,
                      projectStart,
                      projectFinish
                  )
              )
            : 0;

    return {
        activities:
            resultActivities,

        projectStart,
        projectFinish,

        projectDuration,
        projectDurationHours,

        criticalPath,
        warnings
    };
}

export const cpmSchedulerConstants = {
    EPSILON,
    DEFAULT_MAX_ITERATIONS
};