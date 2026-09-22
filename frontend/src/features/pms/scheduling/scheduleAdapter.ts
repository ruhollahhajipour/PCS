import type {
    GanttActivity,
    GanttRelationship,
    GanttRow,
    GanttProject,
    HierarchicalGanttProject
} from "../api/ganttApi";

import type {
    ScheduleActivity,
    ScheduleCalendar,
    ScheduleOptions,
    ScheduleRelationship,
    ScheduleResult,
    ScheduledActivity
} from "./scheduleTypes";

import { normalizeRelationshipType } from "./relationshipEngine";
import { getDefaultCalendar } from "./calendarEngine";

/**
 * Adapter between the PMS/Gantt API model and the independent scheduling engine.
 *
 * Important scheduling contract:
 * - start / finish are CURRENT CALCULATED SCHEDULE outputs.
 * - plannedStart / plannedFinish are retained as the user's planning anchors
 *   when an explicit scheduling constraint has not been supplied.
 * - a previously calculated start/finish must never be fed back as an explicit
 *   Scheduler input on the next pass.
 */

export interface ScheduleAdapterOptions {
    calendars?: Record<string, ScheduleCalendar>;
    defaultCalendarId?: string;
    /** Explicit calendar per activity. Missing/null means inherit project calendar. */
    activityCalendarIds?: Record<string, string | null | undefined>;
    defaultDuration?: number;
}

export interface AdaptedSchedule {
    activities: ScheduleActivity[];
    calendars: Record<string, ScheduleCalendar>;
    defaultCalendarId: string;
}

export interface AppliedScheduleResult {
    rows: GanttRow[];
    activities: GanttActivity[];
    result: ScheduleResult;
}

function finite(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeProgress(value: unknown): number {
    const numeric = finite(value, 0);
    return numeric > 1 ? numeric / 100 : numeric;
}

function normalizeDate(value: unknown): string | null {
    if (value === null || value === undefined || value === "") return null;
    if (value instanceof Date) return value.toISOString();

    const text = String(value).trim();
    if (!text) return null;

    // Date-only values are intentionally preserved as local calendar dates.
    // The calendar engine owns date parsing so timezone conversion cannot move
    // a PMS date to the previous day.
    return text;
}

function normalizeRelationship(
    relationship: GanttRelationship,
    successorId: string
): ScheduleRelationship | null {
    const predecessorId = String(relationship.activityId ?? "").trim();
    if (!predecessorId) return null;
    if (predecessorId === successorId) return null;

    const rawLag = Number(relationship.lag);
    const lag = Number.isFinite(rawLag) ? rawLag : 0;

    return {
        predecessorId,
        successorId,
        type: normalizeRelationshipType(relationship.type),
        lag,
        lagUnit: "days"
    };
}

function relationshipsFromApi(
    relationships: GanttRelationship[] | undefined,
    successorId: string
): ScheduleRelationship[] {
    if (!relationships?.length) return [];

    const seen = new Set<string>();
    const result: ScheduleRelationship[] = [];

    for (const relationship of relationships) {
        const normalized = normalizeRelationship(relationship, successorId);
        if (!normalized) continue;

        const key = [
            normalized.predecessorId,
            normalized.successorId,
            normalized.type,
            normalized.lag,
            normalized.lagUnit
        ].join("|");

        if (seen.has(key)) continue;
        seen.add(key);
        result.push(normalized);
    }

    return result;
}

function rowToScheduleActivity(
    row: GanttRow,
    options: ScheduleAdapterOptions
): ScheduleActivity | null {
    if (row.type !== "activity") return null;

    const predecessors = relationshipsFromApi(row.predecessors, row.id);

    // The Scheduler must never receive row.start/row.finish as explicit input,
    // because those fields are overwritten with calculated CPM output after
    // every schedule pass. Planned dates are the stable planning anchors.
    const planningStart = row.plannedStart ?? row.start;
    const planningFinish = row.plannedFinish ?? row.finish;

    return {
        id: row.id,
        code: row.code,
        name: row.name,
        start: null,
        finish: null,
        plannedStart: normalizeDate(planningStart),
        plannedFinish: normalizeDate(planningFinish),
        duration: Math.max(
            0,
            finite(row.duration, options.defaultDuration ?? 0)
        ),
        remainingDuration:
            row.remainingDuration === undefined
                ? undefined
                : Math.max(0, finite(row.remainingDuration, 0)),
        actualStart: normalizeDate(row.actualStart),
        actualFinish: normalizeDate(row.actualFinish),
        constraintType: row.constraintType ?? "None",
        constraintDate: normalizeDate(row.constraintDate),
        isMilestone: Boolean(row.isMilestone),
        activityType: row.isMilestone ? "StartMilestone" : "TaskDependent",
        calendarId: options.activityCalendarIds?.[row.id] ?? undefined,
        predecessors,
        successors: []
    };
}

function flattenRows(rows: GanttRow[], output: GanttRow[] = []): GanttRow[] {
    for (const row of rows) {
        output.push(row);
        if (row.children?.length) flattenRows(row.children, output);
    }
    return output;
}

function normalizeCalendars(
    calendars: Record<string, ScheduleCalendar> | undefined,
    defaultCalendarId?: string
): { calendars: Record<string, ScheduleCalendar>; defaultCalendarId: string } {
    const fallback = getDefaultCalendar();
    const result = { ...(calendars ?? {}) };

    if (!result.standard) result.standard = fallback;

    const selected =
        defaultCalendarId && result[defaultCalendarId]
            ? defaultCalendarId
            : result.standard
              ? "standard"
              : Object.keys(result)[0] ?? "standard";

    if (!result[selected]) result[selected] = fallback;

    return {
        calendars: result,
        defaultCalendarId: selected
    };
}

export function adaptGanttRowsToSchedule(
    rows: GanttRow[],
    options: ScheduleAdapterOptions = {}
): AdaptedSchedule {
    const normalizedCalendars = normalizeCalendars(
        options.calendars,
        options.defaultCalendarId
    );

    const flatRows = flattenRows(rows);
    const activities = flatRows
        .map(row => rowToScheduleActivity(row, {
            ...options,
            defaultCalendarId: normalizedCalendars.defaultCalendarId
        }))
        .filter((activity): activity is ScheduleActivity => activity !== null);

    const activityMap = new Map(activities.map(activity => [activity.id, activity]));

    for (const activity of activities) {
        activity.successors = [];
    }

    for (const activity of activities) {
        for (const relationship of activity.predecessors ?? []) {
            const predecessor = activityMap.get(relationship.predecessorId);
            if (!predecessor) continue;

            predecessor.successors ??= [];
            predecessor.successors.push(relationship);
        }
    }

    return {
        activities,
        calendars: normalizedCalendars.calendars,
        defaultCalendarId: normalizedCalendars.defaultCalendarId
    };
}

export function adaptGanttActivityToSchedule(
    activities: GanttActivity[],
    options: ScheduleAdapterOptions = {}
): AdaptedSchedule {
    const rows: GanttRow[] = activities.map(activity => ({
        id: activity.id,
        type: "activity",
        code: activity.code,
        name: activity.name,
        level: activity.wbsLevel ?? 0,
        start: activity.start,
        finish: activity.finish,
        duration: activity.duration,
        plannedStart: activity.plannedStart == null
            ? null
            : String(activity.plannedStart),
        plannedFinish: activity.plannedFinish == null
            ? null
            : String(activity.plannedFinish),
        actualStart: activity.actualStart,
        actualFinish: activity.actualFinish,
        remainingDuration: activity.remainingDuration,
        constraintType: activity.constraintType,
        constraintDate: activity.constraintDate,
        progress: normalizeProgress(activity.progress),
        float: activity.float,
        totalFloat: activity.totalFloat,
        freeFloat: activity.freeFloat,
        drivingFloat: activity.drivingFloat,
        isCritical: activity.isCritical,
        isMilestone: activity.isMilestone,
        predecessors: activity.predecessors,
        successors: activity.successors,
        children: []
    }));

    return adaptGanttRowsToSchedule(rows, options);
}

export function adaptGanttProjectToSchedule(
    project: GanttProject | HierarchicalGanttProject,
    options: ScheduleAdapterOptions = {}
): AdaptedSchedule {
    if ("rows" in project) {
        return adaptGanttRowsToSchedule(project.rows, options);
    }

    return adaptGanttActivityToSchedule(project.activities, options);
}

function scheduledValue(
    result: ScheduleResult,
    activityId: string
): ScheduledActivity | undefined {
    return result.activities[activityId];
}

function applyScheduleToRow(
    row: GanttRow,
    result: ScheduleResult
): GanttRow {
    const children = row.children?.map(child =>
        applyScheduleToRow(child, result)
    ) ?? [];

    if (row.type !== "activity") {
        return {
            ...row,
            children
        };
    }

    const scheduled = scheduledValue(result, row.id);
    if (!scheduled) return { ...row, children };

    return {
        ...row,
        // These fields are explicitly CURRENT / CALCULATED schedule output.
        // They are intentionally not copied back into ScheduleActivity.start /
        // finish by the adapter on the next pass.
        start: scheduled.earlyStart
            ? scheduled.earlyStart.getTime()
            : row.start,
        finish: scheduled.earlyFinish
            ? scheduled.earlyFinish.getTime()
            : row.finish,
        totalFloat: scheduled.totalFloat,
        freeFloat: scheduled.freeFloat,
        drivingFloat: scheduled.drivingFloat,
        float: scheduled.totalFloat,
        isCritical: scheduled.isCritical,
        children
    };
}

function applyScheduleToActivity(
    activity: GanttActivity,
    result: ScheduleResult
): GanttActivity {
    const scheduled = scheduledValue(result, activity.id);
    if (!scheduled) return activity;

    return {
        ...activity,
        start: scheduled.earlyStart
            ? scheduled.earlyStart.getTime()
            : activity.start,
        finish: scheduled.earlyFinish
            ? scheduled.earlyFinish.getTime()
            : activity.finish,
        earlyStart: scheduled.earlyStart
            ? scheduled.earlyStart.getTime()
            : activity.earlyStart,
        earlyFinish: scheduled.earlyFinish
            ? scheduled.earlyFinish.getTime()
            : activity.earlyFinish,
        lateStart: scheduled.lateStart
            ? scheduled.lateStart.getTime()
            : activity.lateStart,
        lateFinish: scheduled.lateFinish
            ? scheduled.lateFinish.getTime()
            : activity.lateFinish,
        totalFloat: scheduled.totalFloat,
        freeFloat: scheduled.freeFloat,
        drivingFloat: scheduled.drivingFloat,
        float: scheduled.totalFloat,
        isCritical: scheduled.isCritical
    };
}

export function applyScheduleResultToRows(
    rows: GanttRow[],
    result: ScheduleResult
): GanttRow[] {
    return rows.map(row => applyScheduleToRow(row, result));
}

export function applyScheduleResultToActivities(
    activities: GanttActivity[],
    result: ScheduleResult
): GanttActivity[] {
    return activities.map(activity =>
        applyScheduleToActivity(activity, result)
    );
}

export function applyScheduleResult(
    source: GanttProject | HierarchicalGanttProject,
    result: ScheduleResult
): AppliedScheduleResult {
    if ("rows" in source) {
        return {
            rows: applyScheduleResultToRows(source.rows, result),
            activities: [],
            result
        };
    }

    return {
        rows: [],
        activities: applyScheduleResultToActivities(source.activities, result),
        result
    };
}

export function buildScheduleOptions(
    options: ScheduleOptions = {},
    adapter: ScheduleAdapterOptions = {}
): ScheduleOptions {
    const normalized = normalizeCalendars(
        adapter.calendars,
        adapter.defaultCalendarId
    );

    return {
        ...options,
        defaultCalendarId:
            options.defaultCalendarId ?? normalized.defaultCalendarId
    };
}
