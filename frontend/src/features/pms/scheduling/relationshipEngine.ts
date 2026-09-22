import type {
    ScheduleActivity,
    ScheduleRelationship,
    RelationshipType
} from "./scheduleTypes";
import {
    addWorkingDays,
    addWorkingHours,
    subtractWorkingDays,
    subtractWorkingHours,
    toDate
} from "./calendarEngine";
import type { ScheduleCalendar } from "./scheduleTypes";

export interface RelationshipDateContext {
    predecessorStart: Date | null;
    predecessorFinish: Date | null;
    successorStart: Date | null;
    successorFinish: Date | null;
}

export function normalizeRelationshipType(type: string | undefined): RelationshipType {
    const value = String(type ?? "FS").trim().toUpperCase();
    if (value === "SS" || value === "FF" || value === "SF") return value;
    return "FS";
}

export function normalizeLagUnit(
    relationship: Pick<ScheduleRelationship, "lagUnit">
): "days" | "hours" {
    return relationship.lagUnit === "hours" ? "hours" : "days";
}

export function applyLag(
    calendar: ScheduleCalendar,
    date: Date,
    lag = 0,
    unit: "days" | "hours" = "days"
): Date {
    if (!Number.isFinite(lag) || lag === 0) return new Date(date.getTime());

    return unit === "hours"
        ? addWorkingHours(calendar, date, lag)
        : addWorkingDays(calendar, date, lag);
}

export function removeLag(
    calendar: ScheduleCalendar,
    date: Date,
    lag = 0,
    unit: "days" | "hours" = "days"
): Date {
    if (!Number.isFinite(lag) || lag === 0) return new Date(date.getTime());

    return unit === "hours"
        ? subtractWorkingHours(calendar, date, lag)
        : subtractWorkingDays(calendar, date, lag);
}

/**
 * Normalizes the API's predecessor relation into the scheduler graph model.
 * In the current PMS API, GanttRelationship.activityId identifies the
 * predecessor when the relationship is stored inside activity.predecessors.
 */
export function getActivityRelationships(
    activity: ScheduleActivity
): ScheduleRelationship[] {
    return (activity.predecessors ?? []).map((relationship) => ({
        predecessorId:
            relationship.predecessorId ||
            relationship.successorId ||
            "",
        successorId: relationship.successorId || activity.id,
        type: normalizeRelationshipType(relationship.type),
        lag: Number.isFinite(Number(relationship.lag))
            ? Number(relationship.lag)
            : 0,
        lagUnit: normalizeLagUnit(relationship)
    })).filter(
        relationship =>
            Boolean(relationship.predecessorId) &&
            Boolean(relationship.successorId)
    );
}

export function predecessorRequiredSuccessorStart(
    relationship: ScheduleRelationship,
    predecessor: RelationshipDateContext,
    calendar: ScheduleCalendar
): Date | null {
    const type = normalizeRelationshipType(relationship.type);
    const lag = Number(relationship.lag ?? 0);
    const unit = normalizeLagUnit(relationship);

    if (type === "FS") {
        if (!predecessor.predecessorFinish) return null;
        return applyLag(calendar, predecessor.predecessorFinish, lag, unit);
    }

    if (type === "SS") {
        if (!predecessor.predecessorStart) return null;
        return applyLag(calendar, predecessor.predecessorStart, lag, unit);
    }

    return null;
}

export function predecessorRequiredSuccessorFinish(
    relationship: ScheduleRelationship,
    predecessor: RelationshipDateContext,
    calendar: ScheduleCalendar
): Date | null {
    const type = normalizeRelationshipType(relationship.type);
    const lag = Number(relationship.lag ?? 0);
    const unit = normalizeLagUnit(relationship);

    if (type === "FF") {
        if (!predecessor.predecessorFinish) return null;
        return applyLag(calendar, predecessor.predecessorFinish, lag, unit);
    }

    if (type === "SF") {
        if (!predecessor.predecessorStart) return null;
        return applyLag(calendar, predecessor.predecessorStart, lag, unit);
    }

    return null;
}

export function relationshipDescription(relationship: ScheduleRelationship): string {
    const type = normalizeRelationshipType(relationship.type);
    const lag = Number(relationship.lag ?? 0);
    const unit = normalizeLagUnit(relationship);

    if (!lag) return type;
    const sign = lag > 0 ? "+" : "";
    return `${type} ${sign}${lag}${unit === "hours" ? "h" : "d"}`;
}

export function relationshipDateContext(
    predecessor: ScheduleActivity,
    successor?: ScheduleActivity
): RelationshipDateContext {
    return {
        predecessorStart: toDate(predecessor.plannedStart ?? predecessor.start),
        predecessorFinish: toDate(predecessor.plannedFinish ?? predecessor.finish),
        successorStart: toDate(successor?.plannedStart ?? successor?.start),
        successorFinish: toDate(successor?.plannedFinish ?? successor?.finish)
    };
}
